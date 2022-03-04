import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import clsx from 'clsx'
import { Button } from 'components/button'
import { useForm, FormProvider } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { formatFileSize } from 'utils/format-file-size'
import { FileTypeIcon } from './file-type-icon'

interface IFileInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string
  name: string
}

const FILE_SIZE_LIMIT = 100

const schema = Yup.object().shape({
  file: Yup.mixed()
    .test('required', 'File is required', value => {
      return value.length > 0
    })
    .test('fileCount', 'File count exceeded. Max file count: 1', value => {
      return value.length === 1
    })
    .test('size', 'File size is too large', value => {
      const fileSize = value[0].size / 1024 / 1024
      return FILE_SIZE_LIMIT >= fileSize
    }),
})

const FileInput: FC<IFileInputProps> = props => {
  const { name, label = name } = props
  const { setValue, watch } = useFormContext()

  watch(name)

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    droppedFiles => {
      setValue(name, droppedFiles, { shouldValidate: true })
    },
    [setValue, name],
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.accept,
  })

  return (
    <>
      <div>
        <div
          className={clsx(
            'flex flex-col justify-center items-center bg-orange-50 pb-4 border border-2 rounded-md border-orange-500 hover:cursor-pointer',
            isDragActive && 'border-dashed',
          )}
          style={{ height: '400px' }}
          {...getRootProps()}
        >
          <p className="text-lg pb-4"> Drag and drop you file here</p>
          <label
            className="flex items-center justify-center py-2 px-4 rounded shadow-md bg-orange-500 text-white font-semibold hover:cursor-pointer hover:bg-orange-400"
            onClick={e => {
              e.preventDefault()
            }}
            htmlFor={name}
          >
            {isDragActive ? 'Release to drop' : label}
          </label>
          <input
            {...props}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={name}
            {...getInputProps()}
          />
        </div>
      </div>
    </>
  )
}

interface DragAndDropFileUpload {
  onFileSubmit: (file: File[]) => void
}

export const DragAndDropFileUpload: React.FC<DragAndDropFileUpload> = ({ onFileSubmit }) => {
  const methods = useForm<{ file: File }>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = methods.handleSubmit(values => {
    /* TODO - Fix problem with typing. Issue here lies somewhere between useForm and handling errorMessages.
     Input is really File[] however react--hook-form casts File[] as multiple ErrorMessages[]
    */
    onFileSubmit(values.file as unknown as File[])
  })

  const {
    formState: { errors, isValid },
    reset,
  } = methods

  const { watch, register } = methods

  register('file')
  const files = watch('file') as unknown as File[]
  const fileErrorMessage = errors.file?.message

  const [feeEstimation, setFeeEstimation] = useState<null | number>(null)

  useEffect(() => {
    if (files && files.length > 0) {
      fetch('https://arweave.net/price/' + files[0].size)
        .then(res => res.json())
        .then(price => setFeeEstimation(price))
    }
  }, [files, setFeeEstimation])

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        {files && isValid && (
          <div className="flex items-center my-2">
            <FileTypeIcon fileType={files[0].type} className="w-10 h-10" />
            <span className="text-sm text-gray-700 font-semibold">
              {`"${files[0].name}" - ${formatFileSize(files[0].size)} -
             ${feeEstimation ? feeEstimation / 1000000000000 : ''} AR fee
            `}
            </span>
          </div>
        )}
        {files && isValid ? null : <FileInput label="Choose file to upload" name="file" />}
        {fileErrorMessage && (
          <div className="pt-2">
            <p className="text-sm font-semibold text-red-500 uppercase tracking-wide"> {fileErrorMessage} </p>
          </div>
        )}
        {files && isValid && (
          <div>
            <Button className="mt-4" type="submit">
              Upload
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="mx-2"
              onClick={() => {
                reset(undefined, { keepIsValid: false })
              }}
            >
              Reset
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}

export interface FileListProps {
  files: File[]
}

function list(files: File[] = []) {
  if (files.length === 0) {
    return null
  }
  const label = (file: File) => `'${file.name}' of size '${file.size}' and type '${file.type}'`
  return files.map(file => <li key={file.name}>{label(file)}</li>)
}

export const FileList: FC<FileListProps> = ({ files }) => {
  const fileList = useMemo(() => list(files), [files])
  return <div>{fileList}</div>
}
