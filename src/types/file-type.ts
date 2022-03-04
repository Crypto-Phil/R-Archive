export const fileTypeDictionary = {
  'text/csv': 'text/csv',
  'application/pdf': 'application/pdf',
  // video: 'TODO',
  'text/plain': 'text/plain',
  // picture: 'TODO',
}

export type FileTypeKeys = keyof typeof fileTypeDictionary
