import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalContents, ModalOpenButton } from 'components/modal'
import { DragAndDropFileUpload } from 'components/drag-and-drop-file-upload'
import { Button } from 'components/button'
import { useArweave } from 'context/arweave'
import { useTransactionsByOwner } from 'utils/client'
import { ArweaveGQLTypes } from 'utils/gql-schema'
import Spinner from 'assets/spinner.svg'
import { FileTypeIcon } from 'components/file-type-icon'
import DownloadIcon from 'assets/download-icon.svg'
import FileSaver from 'file-saver'
import { MetaDataForm, MetaDataFormInputs } from 'components/meta-data-form'
import { metaDataFieldsLabels } from 'constants/meta-data-fields'
import { fileDecrypt } from 'ardrive-core-js/lib/crypto'
import { useAuth } from 'context/auth-context'
import { formatFileSize } from 'utils/format-file-size'
import { URL } from 'utils/url'
import { v4 as uuidv4 } from 'uuid'
import { readFileAsText } from 'utils/read-file-as-text'
import { readFileAsArrayBuffer } from 'utils/read-file-as-array-buffer'
import { fileEncrypt, deriveFileKey } from 'utils/crypto'
import { useDriveKey } from 'hooks/useDriveKey'
import jwkToPem, { JWK } from 'jwk-to-pem'
import { addMetaTransactionTags, prepareMetaData, MetaData } from 'utils/meta-transaction-utils'
import Transaction from 'arweave/node/lib/transaction'
import clsx from 'clsx'

function DocumentsScreen() {
  const [file, setFile] = useState<File[]>([])
  const [uploadMode, setUploadMode] = useState(false)
  const [arweave] = useArweave()
  const { state } = useAuth()
  const deriveDriveKey = useDriveKey()

  const handleFilePick = (fileToUpload: File[]) => {
    setFile(fileToUpload)
    setUploadMode(true)
  }
  const handleFormSubmit = async (values: MetaDataFormInputs) => {
    // Prepare data
    const data = file[0].type.startsWith('text') ? await readFileAsText(file[0]) : await readFileAsArrayBuffer(file[0])
    const fileId = uuidv4()
    const driveId = uuidv4()
    const password = jwkToPem(state.privateKey as JWK, { private: true })
    const driveKey = await deriveDriveKey(password, driveId)
    const fileKey = await deriveFileKey(fileId, driveKey)
    const bufData = Buffer.from(data as ArrayBuffer)
    const encryptedFile = await fileEncrypt(fileKey, bufData)

    // Create transaction and sign
    const transaction: Transaction = await arweave.createTransaction({ data: encryptedFile.data }, state.privateKey)
    transaction.addTag('cipher', encryptedFile.cipher)
    transaction.addTag('cipherIV', encryptedFile.cipherIV)
    transaction.addTag('File-Name', file[0].name)
    transaction.addTag('File-Id', fileId)
    transaction.addTag('Archive-Id', driveId)
    transaction.addTag('Unix-Time', new Date().getTime().toString())
    transaction.addTag('Transaction-Type', 'DataTransaction')
    await arweave.transactions.sign(transaction, state.privateKey)

    // Prepare meta data
    const metaData = prepareMetaData({
      values,
      transactionId: transaction.id,
      fileId,
      fileSize: file[0].size,
      fileType: file[0].type,
    })

    const bufMetaData = Buffer.from(JSON.stringify(metaData))
    const encryptedMetaData = await fileEncrypt(fileKey, bufMetaData)

    // Create meta transaction and sign
    const metaTransaction: Transaction = await arweave.createTransaction(
      { data: encryptedMetaData.data },
      state.privateKey,
    )
    addMetaTransactionTags(metaTransaction, { driveId, fileId, fileType: file[0].type, encryptedMetaData })
    await arweave.transactions.sign(metaTransaction, state.privateKey)

    // Upload transaction
    const uploader = await arweave.transactions.getUploader(transaction)
    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      // eslint-disable-next-line no-console
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
    }

    // Upload meta transaction
    const metaUploader = await arweave.transactions.getUploader(metaTransaction)
    while (!metaUploader.isComplete) {
      await metaUploader.uploadChunk()
      // eslint-disable-next-line no-console
      console.log(`${metaUploader.pctComplete}% complete, ${metaUploader.uploadedChunks}/${metaUploader.totalChunks}`)
    }
    if (process.env.DEPLOY_ENV === 'development') {
      await fetch('http://localhost:1984/mine')
    }
    setUploadMode(false)
    setFile([])
  }

  const { name: fileName, size: fileSize, type } = file[0] || {}

  const parsedFileSize = React.useMemo(() => formatFileSize(fileSize), [fileSize])

  return (
    <div className="p-8">
      {file.length > 0 ? (
        <React.Fragment>
          <div>
            <h2 className="text-3xl font-semibold"> Provide Information </h2>
            <div className="flex items-center my-2">
              <FileTypeIcon fileType={type} className="w-10 h-10" />
              <span className="text-sm text-gray-700 font-semibold">{`"${fileName}" - ${parsedFileSize}`}</span>
            </div>
          </div>
          <MetaDataForm onSubmit={handleFormSubmit} />
        </React.Fragment>
      ) : (
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold"> Rohingya Project Pilot 2021 </h2>
          <Modal>
            <ModalOpenButton>
              <Button>Upload New</Button>
            </ModalOpenButton>
            <ModalContents title="Upload document">
              <DragAndDropFileUpload onFileSubmit={handleFilePick} />
            </ModalContents>
          </Modal>
        </div>
      )}
      {!uploadMode && <DocumentList />}
    </div>
  )
}

function DocumentList() {
  const [arweave] = useArweave()
  const { state } = useAuth()
  const navigate = useNavigate()
  const deriveDriveKey = useDriveKey()
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const {
    data: transactionData,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useTransactionsByOwner([
    {
      name: 'Transaction-Type',
      values: ['MetaTransaction'],
    },
  ])
  const [document, setDocument] = useState<null | Partial<MetaData>>(null)
  const [fileToDownload, setCurrentFileToDownload] = useState<null | { type: string }>(null)

  const handleClick = async (tx: ArweaveGQLTypes.TransactionsEdgeResponse) => {
    const data = transactionData?.pages
      .flat()
      .find(transaction => transaction.transactions.node.id === tx.node.id)?.transactionData

    if (!data) {
      return
    }

    if (typeof data === 'string') {
      setDocument(JSON.parse(data))
      setCurrentFileToDownload({ type: tx.node.data.type ?? '' })
    } else {
      setDocument(data)
      setCurrentFileToDownload({ type: data.dataContentType ?? '' })
    }
  }

  const handleDownload = async () => {
    if (document?.dataTxId && fileToDownload) {
      setDownloading(true)
      setError(null)
      try {
        const data = await arweave.transactions.getData(document?.dataTxId, { decode: true })
        const transaction = await arweave.transactions.get(document?.dataTxId).catch(e => {
          if (e.type && e.type === 'TX_FAILED') {
            throw new Error('Overspend')
          }
          throw e
        })

        const encryptedData = Buffer.from(data)

        const tags = transaction.tags.map(tag => {
          return {
            name: tag.get('name', { decode: true, string: true }),
            value: tag.get('value', { decode: true, string: true }),
          }
        })

        const cipherIV = tags.find(tag => tag.name === 'cipherIV')?.value as string
        const driveId = tags.find(tag => tag.name === 'Archive-Id')?.value as string
        const fileId = tags.find(tag => tag.name === 'File-Id')?.value as string

        const password = jwkToPem(state.privateKey as JWK, { private: true })
        const driveKey = await deriveDriveKey(password, driveId)
        const fileKey = await deriveFileKey(fileId, driveKey)

        const decryptedData = await fileDecrypt(cipherIV, fileKey, encryptedData)

        setDownloading(false)
        const fileName = tags.find(tag => tag.name === 'File-Name')?.value
        const file = new File([decryptedData], fileName || 'download', { type: fileToDownload.type })
        FileSaver.saveAs(file)
      } catch (e) {
        setDownloading(false)
        setError(e as Error)
      }
    }
  }

  const handleMetaDataUpdate = (document: Partial<MetaData> | null) => {
    navigate(URL.updateMetaData.path, { state: document })
  }

  const latestUniqueMetaTransaction = (data: typeof transactionData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueFileId: any = {}
    if (data === undefined) {
      return []
    }

    return data.pages.flat().filter(item => {
      const fileIdTag = item.transactions.node.tags.find(tag => tag.name === 'File-Id')

      if (fileIdTag) {
        return uniqueFileId[fileIdTag.value] ? false : (uniqueFileId[fileIdTag.value] = true)
      }
      return false
    })
  }

  const handleLoadMore = () => {
    fetchNextPage()
  }

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center h-96 text-gray-800">
          <Spinner className="animate-spin -ml-1 mr-3 h-12 w-12 text-white" />
        </div>
      )}
      <Modal>
        <div className="grid grid-cols-4 gap-4 mt-8">
          {latestUniqueMetaTransaction(transactionData).map(({ transactions, transactionData }) => (
            <ModalOpenButton key={transactions.node.id}>
              <DocumentListItem
                onClick={() => handleClick(transactions)}
                data={{
                  size: transactions.node.data.size,
                  type: transactions.node.data.type as string,
                  transactionData,
                }}
              />
            </ModalOpenButton>
          ))}
          {!isLoading && (
            <div className="col-span-4 h-24 flex justify-center items-end">
              <Button onClick={handleLoadMore} disabled={isFetching}>
                <div className="flex items-center">
                  <span>Load more </span>
                  {isFetching && <Spinner className="animate-spin ml-2 h-4 w-4 text-white" />}
                </div>
              </Button>
            </div>
          )}
        </div>
        <ModalContents title="Document">
          <ol>
            {document &&
              Object.entries(document).map(([key, value], index) => (
                <li className="grid grid-cols-2" key={key}>
                  <span>
                    {index + 1}. {metaDataFieldsLabels[key as unknown as keyof MetaData] || key}
                  </span>
                  <span className="break-words">{value}</span>
                </li>
              ))}
          </ol>
          <div className={clsx('flex mt-8', downloading ? 'items-center' : 'items-end')}>
            <Button onClick={() => handleMetaDataUpdate(document)}>Update Metadata</Button>
            {downloading ? (
              <div>
                <Spinner className="animate-spin ml-4 h-8 w-8 text-white" />
              </div>
            ) : (
              <DownloadIcon
                aria-disabled={downloading}
                className="ml-4 w-8 h-8 hover:bounce hover:cursor-pointer"
                onClick={handleDownload}
              />
            )}
            {error && (
              <p className="ml-4 text-red-500 text-xs italic">
                <pre>{error.message ? error.message : JSON.stringify(error)}</pre>
              </p>
            )}
          </div>
        </ModalContents>
      </Modal>
    </div>
  )
}

interface DocumentListItemProps {
  data: {
    size: string
    type: string
    transactionData: Partial<MetaData>
  }
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

function DocumentListItem({ data, onClick }: DocumentListItemProps) {
  return (
    <div
      onClick={onClick}
      className="max-w-sm py-4 px-6 bg-white shadow-md rounded-lg hover:shadow-lg hover:cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-gray-800 text-xl font-semibold leading-6">
          {[data?.transactionData?.documentTitle || 'Document Title', data?.transactionData?.principlePersonNamedOnDoc]
            .filter(Boolean)
            .join(' - ')}
        </h2>
        <FileTypeIcon fileType={data.type} className="w-16 h-16" />
      </div>
      {data.transactionData.documentPurpose && (
        <div>
          <h3 className="text-xl text-gray-600">Document description</h3>
          <p className="mt-2 text-base leading-4">{data.transactionData.documentPurpose}</p>
        </div>
      )}
    </div>
  )
}

export { DocumentsScreen }
