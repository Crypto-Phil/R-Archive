export const URL = {
  documents: { path: '/documents' },
  updateMetaData: { path: '/update-meta-data' },
  build: {
    updateMetaData: (documentId: string | number) => `/update-meta-data/${documentId}`,
  },
} as const
