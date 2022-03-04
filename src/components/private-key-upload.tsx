import React from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FileInput } from './file-input'

interface PrivateKeyProps {
  onSubmit: (data: { privateKey: FileList }) => void
}

type FormInputs = {
  privateKey: FileList
}

const supportedFormats = ['application/json']
const FILE_SIZE_LIMIT = 5

const schema = Yup.object().shape({
  privateKey: Yup.mixed()
    .test('required', 'File is required', value => {
      return value.length > 0
    })
    .test('size', 'File size is too large', value => {
      if (value.length === 0) {
        return false
      }
      const fileSize = value[0].size / 1024 / 1024
      return FILE_SIZE_LIMIT >= fileSize
    })
    .test('type', 'Unsupported file format. Supported formats: .json', value => {
      if (value.length === 0) {
        return false
      }
      return supportedFormats.includes(value[0].type)
    })
    .test('validFile', 'Not valid private key file', () => {
      //TODO - Add validation for field {"kty": "RSA"} to check if uploaded JSON file is valid
      return true
    }),
})

export const PrivateKeyUpload = ({ onSubmit }: PrivateKeyProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormInputs>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const handleChange = async () => {
    const isValid = await trigger('privateKey')

    if (isValid) {
      await handleSubmit(onSubmit)()
    }
  }

  const privateKey = register('privateKey')
  const privateKeyErrorMessage = errors.privateKey?.message

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="py-2 px-4">
        <FileInput
          label="Choose Key File"
          ref={privateKey.ref}
          name={privateKey.name}
          onChange={e => {
            privateKey.onChange(e)
            handleChange()
          }}
        />
      </div>
      {privateKeyErrorMessage && (
        <div>
          <p className="text-sm font-semibold text-red-500 uppercase tracking-wide"> {privateKeyErrorMessage} </p>
        </div>
      )}
    </form>
  )
}
