import * as crypto from 'crypto'
import { parse } from 'uuid'
import * as guards from './type_guards'

export interface ArFSEncryptedData {
  cipher: guards.CipherType
  cipherIV: string
  data: Buffer
}

import hkdf from 'futoin-hkdf'
import utf8 from 'utf8'
import jwkToPem, { JWK } from 'jwk-to-pem'

const authTagLength = 16
const keyByteLength = 32
const algo = 'aes-256-gcm' // crypto library does not accept this in uppercase. So gotta keep using aes-256-gcm
const keyHash = 'SHA-256'

// Gets an unsalted SHA256 signature from an Arweave wallet's private PEM file
export async function getArweaveWalletSigningKey(jwk: JWK, data: Uint8Array): Promise<Uint8Array> {
  const sign = crypto.createSign('rsa-sha256')
  sign.update(data)
  const pem: string = jwkToPem(jwk, { private: true })
  const signature = sign.sign({
    key: pem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: 0, // We do not need to salt the signature since we combine with a random UUID
  })
  return signature
}

// Derive a key from the user's ArDrive ID, JWK and Data Encryption Password (also their login password)
export async function deriveDriveKey(
  dataEncryptionKey: crypto.BinaryLike,
  driveId: string,
  walletPrivateKey: string,
): Promise<Buffer> {
  const driveIdBytes: Buffer = Buffer.from(parse(driveId) as Uint8Array) // The UUID of the driveId is the SALT used for the drive key
  const driveBuffer: Buffer = Buffer.from(utf8.encode('drive'))
  const signingKey: Buffer = Buffer.concat([driveBuffer, driveIdBytes])
  const walletSignature: Uint8Array = await getArweaveWalletSigningKey(JSON.parse(walletPrivateKey), signingKey)
  const info: string = utf8.encode(dataEncryptionKey as string)
  const driveKey: Buffer = hkdf(Buffer.from(walletSignature), keyByteLength, { info, hash: keyHash })
  return driveKey
}

// Derive a key from the user's Drive Key and the File Id
export async function deriveFileKey(fileId: string, driveKey: Buffer): Promise<Buffer> {
  const info: Buffer = Buffer.from(parse(fileId) as Uint8Array)
  const fileKey: Buffer = hkdf(driveKey, keyByteLength, { info, hash: keyHash })
  return fileKey
}

// New ArFS File encryption function using a buffer and using ArDrive KDF with AES-256-GCM
export async function fileEncrypt(fileKey: Buffer, data: Buffer): Promise<ArFSEncryptedData> {
  const iv: Buffer = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(algo, fileKey, iv, { authTagLength })
  const encryptedBuffer: Buffer = Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag()])
  const encryptedFile: ArFSEncryptedData = {
    cipher: 'AES256-GCM',
    cipherIV: iv.toString('base64'),
    data: encryptedBuffer,
  }
  return encryptedFile
}

// New ArFS File decryption function, using ArDrive KDF and AES-256-GCM
export async function fileDecrypt(cipherIV: string, fileKey: Buffer, data: Buffer): Promise<Buffer> {
  try {
    const authTag: Buffer = data.slice(data.byteLength - authTagLength, data.byteLength)
    const encryptedDataSlice: Buffer = data.slice(0, data.byteLength - authTagLength)
    const iv: Buffer = Buffer.from(cipherIV, 'base64')
    const decipher = crypto.createDecipheriv(algo, fileKey, iv, { authTagLength })
    decipher.setAuthTag(authTag)
    const decryptedFile: Buffer = Buffer.concat([decipher.update(encryptedDataSlice), decipher.final()])
    return decryptedFile
  } catch (err) {
    console.log(err)
    console.log('Error decrypting file data')
    // throw new Error("Error")
    return Buffer.from('Error', 'ascii')
  }
}
