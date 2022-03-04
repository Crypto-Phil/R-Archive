import { MetaDataForm, MetaDataFormInputs } from 'components/meta-data-form'
import { useArweave } from 'context/arweave'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { addMetaTransactionTags, getDecodedTags, prepareMetaData, MetaData } from 'utils/meta-transaction-utils'
import { useAuth } from 'context/auth-context'
import Transaction from 'arweave/node/lib/transaction'
import { URL } from 'utils/url'
import jwkToPem, { JWK } from 'jwk-to-pem'
import { fileEncrypt, deriveDriveKey, deriveFileKey } from 'utils/crypto'

function UpdateMetaData() {
  const location = useLocation()
  const navigate = useNavigate()
  const [arweave] = useArweave()
  const { state } = useAuth()
  const {
    state: { privateKey },
  } = useAuth()

  const handleMetaDataUpdate = async (values: MetaDataFormInputs) => {
    const document: MetaData = location.state
    if (document) {
      const transaction = await arweave.transactions.get(document.dataTxId)
      const tags = getDecodedTags(transaction)
      const fileType = document.dataContentType
      const fileSize = document.size
      const driveId = tags.find(tag => tag.name === 'Archive-Id')?.value as string
      const fileId = tags.find(tag => tag.name === 'File-Id')?.value as string
      const metaData = prepareMetaData({ values, transactionId: document.dataTxId, fileId, fileSize, fileType })
      const password = jwkToPem(state.privateKey as JWK, { private: true })
      const driveKey = await deriveDriveKey(password, driveId, JSON.stringify(state.privateKey))
      const fileKey = await deriveFileKey(fileId, driveKey)
      const bufMetaData = Buffer.from(JSON.stringify(metaData))
      const encryptedMetaData = await fileEncrypt(fileKey, bufMetaData)

      const metaTransaction: Transaction = await arweave.createTransaction({ data: encryptedMetaData.data }, privateKey)

      addMetaTransactionTags(metaTransaction, { driveId, fileId, fileType, encryptedMetaData })
      await arweave.transactions.sign(metaTransaction, privateKey)
      const metaUploader = await arweave.transactions.getUploader(metaTransaction)
      while (!metaUploader.isComplete) {
        await metaUploader.uploadChunk()
        // eslint-disable-next-line no-console
        console.log(`${metaUploader.pctComplete}% complete, ${metaUploader.uploadedChunks}/${metaUploader.totalChunks}`)
      }
      if (process.env.DEPLOY_ENV === 'development') {
        await fetch('http://localhost:1984/mine')
      }
      navigate(URL.documents.path)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold"> Update meta data </h2>
      <MetaDataForm defaultFormValues={location.state} onSubmit={handleMetaDataUpdate} />
    </div>
  )
}

export { UpdateMetaData }
