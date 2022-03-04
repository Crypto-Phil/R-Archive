import { MetaData } from 'utils/meta-transaction-utils'

type MetaDataFieldLabelType = {
  [P in keyof MetaData]: string
}

const metaDataFieldsLabels: MetaDataFieldLabelType = {
  alternativeTitle: 'Alternative title',
  authenticityMarks: 'Authenticity marks',
  birthday: 'Birthday',
  dataContentType: 'Data content type',
  dateOfIssuance: 'Date of issuance',
  dataTxId: 'Data tx id',
  documentLanguage: 'Document language',
  documentNumber: 'Official document number',
  documentType: 'Document type',
  documentPurpose: 'Document purpose',
  documentTitle: 'Document title',
  extentOfDocument: 'Extent of document',
  fileId: 'File ID',
  gender: 'Gender',
  includesPhoto: 'Includes photo',
  informationDigitallyRecordedByFO: 'Information digitally recorded by Field Officer',
  issuingAuthority: 'Issuing Authority',
  locationOfScanning: 'Location of scanning',
  nameAndTitleIssuer: 'Name and title issuer',
  nameAndIdNumberOfTranslatingParty: 'Name and ID of translating party',
  nameOfDocumentReview: 'Name of document review',
  notesOnDocumentOrHolder: 'Notes on document or holder',
  officialTitle: 'Official title',
  otherOfficialDates: 'Other official date',
  otherPersonNamedAndRoleOnDoc: 'Other person named and role on doc',
  otherPhysicalAspects: 'Other physical aspects',
  personalInformationDocumentHolder: 'Personal information document holder',
  placeOfBirth: 'Place of birth',
  placeOfIssuance: 'Place of issuance',
  principlePersonNamedOnDoc: 'Principle person named on doc',
  relationshipToOtherDocs: 'Relationship to other docs',
  reviewersNotes: 'Reviewers notes',
  size: 'Size',
  dateOfScanning: 'Date of scanning',
  fieldOfficer: 'Field officer',
  location: 'Location',
}

export { metaDataFieldsLabels, MetaDataFieldLabelType }
