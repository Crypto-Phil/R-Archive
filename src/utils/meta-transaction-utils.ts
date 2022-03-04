import { MetaDataFormInputs } from 'components/meta-data-form'
import Transaction from 'arweave/node/lib/transaction'
import { ArFSEncryptedData } from './crypto'

interface MetaData {
  fieldOfficer: string
  location: string
  dateOfScanning: string
  locationOfScanning: string
  documentTitle?: string
  officialTitle: string
  documentPurpose?: string
  alternativeTitle?: string
  documentType: string
  issuingAuthority?: string
  nameAndIdNumberOfTranslatingParty?: string
  nameAndTitleIssuer?: string
  placeOfIssuance?: string
  dateOfIssuance?: string
  otherOfficialDates?: string
  documentNumber?: string
  includesPhoto?: boolean
  principlePersonNamedOnDoc?: string
  otherPersonNamedAndRoleOnDoc?: string
  personalInformationDocumentHolder?: string
  birthday?: string
  placeOfBirth?: string
  gender?: string
  documentLanguage?: string
  extentOfDocument?: string
  otherPhysicalAspects?: string
  authenticityMarks?: string
  relationshipToOtherDocs?: string
  notesOnDocumentOrHolder?: string
  informationDigitallyRecordedByFO?: boolean
  nameOfDocumentReview: string
  reviewersNotes?: string
  size: number
  dataTxId: string
  dataContentType: string
  fileId: string
}

interface PrepareMetaData {
  values: MetaDataFormInputs
  transactionId: string
  fileSize: number
  fileId: string
  fileType: string
}

function prepareMetaData({ values, transactionId, fileSize, fileId, fileType }: PrepareMetaData): Partial<MetaData> {
  return {
    ...values,
    documentType: values.documentType.name,
    includesPhoto: values.includesPhoto.value,
    informationDigitallyRecordedByFO: values.informationDigitallyRecordedByFO.value,
    gender: values.gender.value,
    documentLanguage: values.documentLanguage.name,
    dataContentType: fileType,
    dataTxId: transactionId,
    size: fileSize,
    fileId: fileId,
  }
}

interface MetaTransactionTags {
  fileType: string
  fileId: string
  driveId: string
  encryptedMetaData: ArFSEncryptedData
}

function addMetaTransactionTags(
  metaTransaction: Transaction,
  { encryptedMetaData, fileType, fileId, driveId }: MetaTransactionTags,
) {
  metaTransaction.addTag('cipher', encryptedMetaData.cipher)
  metaTransaction.addTag('cipherIV', encryptedMetaData.cipherIV)
  metaTransaction.addTag('File-Type', fileType)
  metaTransaction.addTag('File-Id', fileId)
  metaTransaction.addTag('Archive-Id', driveId)
  metaTransaction.addTag('Unix-Time', new Date().getTime().toString())
  metaTransaction.addTag('Transaction-Type', 'MetaTransaction')
}

function getDecodedTags(metaTransaction: Transaction): { name: string; value: string }[] {
  return metaTransaction.tags.map(tag => {
    return {
      name: tag.get('name', { decode: true, string: true }),
      value: tag.get('value', { decode: true, string: true }),
    }
  })
}

export { prepareMetaData, addMetaTransactionTags, getDecodedTags, MetaData }
