import React from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { SelectInput } from 'components/select-input'
import { TextInput } from 'components/text-input'
import { Button } from './button'
import { MetaData } from 'utils/meta-transaction-utils'
import Spinner from 'assets/spinner.svg'
import clsx from 'clsx'
import { MaskInput } from './mask-input'

const documentTypes = [
  {
    id: 1,
    name: 'ID',
  },
  {
    id: 2,
    name: 'Birth Registration',
  },
  {
    id: 3,
    name: 'Evidence of legal status',
  },
  {
    id: 4,
    name: 'Property ownership',
  },
  {
    id: 5,
    name: 'Medical condition',
  },
  {
    id: 6,
    name: 'Personal document',
  },
  {
    id: 7,
    name: 'Education',
  },
  {
    id: 8,
    name: 'Photograph',
  },
  {
    id: 9,
    name: 'Civil Service Certificate',
  },
  {
    id: 10,
    name: 'Video',
  },
  {
    id: 11,
    name: 'Translation',
  },
  {
    id: 12,
    name: 'Other',
  },
]

const booleanOptions = [
  { id: 1, name: 'yes', value: true },
  { id: 2, name: 'no', value: false },
]

const genderOptions = [
  { id: 1, name: 'Male', value: 'male' },
  { id: 2, name: 'Female', value: 'female' },
  { id: 3, name: 'Other', value: 'other' },
]

const documentLanguageOptions = [
  { id: 1, name: 'Burmese' },
  { id: 2, name: 'English' },
  { id: 3, name: 'Arabic' },
  { id: 4, name: 'Other' },
]

interface MetaDataFormInputs {
  fieldOfficer: string
  location: string
  documentType: {
    id: number
    name: string
  }
  documentTitle: string
  dateOfScanning: string
  locationOfScanning: string
  documentPurpose?: string
  nameAndTitleIssuer?: string
  nameAndIdNumberOfTranslatingParty?: string
  issuingAuthority?: string
  nameAndIdNumberOfIssuingOfficer?: string
  placeOfIssuance?: string
  dateOfIssuance?: string
  otherOfficialDates?: string
  documentNumber?: string
  includesPhoto: {
    id: number
    name: string
    value: boolean
  }
  principlePersonNamedOnDoc?: string
  otherPersonNamedAndRoleOnDoc?: string
  birthday?: string
  placeOfBirth?: string
  gender: {
    id: number
    name: string
    value: string
  }
  documentLanguage: {
    id: number
    name: string
  }
  extentOfDocument?: string
  otherPhysicalAspects?: string
  authenticityMarks?: string
  notesOnDocumentOrHolder?: string
  relationshipToOtherDocs?: string
  informationDigitallyRecordedByFO: {
    id: number
    name: string
    value: boolean
  }
  nameOfDocumentReview?: string
  reviewersNotes?: string
}

const validateDate = (value?: string) => {
  if (value && value.replaceAll(' ', '').length === 10) {
    return new Date(value).toString() !== 'Invalid Date'
  }
  return true
}

const schema: Yup.SchemaOf<MetaDataFormInputs> = Yup.object({
  fieldOfficer: Yup.string().required('Field officer name is required'),
  location: Yup.string().required('Location is required'),
  documentType: Yup.object()
    .shape({
      id: Yup.number(),
      name: Yup.string(),
    })
    .required(),
  documentTitle: Yup.string().required('Document title is required'),
  dateOfScanning: Yup.string()
    .required('Date of scanning is required')
    .test('dateOfScanning', 'Date not valid', validateDate),
  locationOfScanning: Yup.string().required(),
  nameAndIdNumberOfTranslatingParty: Yup.string(),
  nameAndTitleIssuer: Yup.string(),
  documentPurpose: Yup.string(),
  issuingAuthority: Yup.string(),
  nameAndIdNumberOfIssuingOfficer: Yup.string(),
  placeOfIssuance: Yup.string(),
  dateOfIssuance: Yup.string().test('dateOfIssuance', 'Date not valid', validateDate).optional(),
  otherOfficialDates: Yup.string(),
  documentNumber: Yup.string(),
  includesPhoto: Yup.object()
    .shape({
      id: Yup.number(),
      name: Yup.string(),
      value: Yup.boolean(),
    })
    .optional(),
  principlePersonNamedOnDoc: Yup.string(),
  otherPersonNamedAndRoleOnDoc: Yup.string(),
  birthday: Yup.string().test('birthday', 'Date not valid', validateDate).optional(),
  placeOfBirth: Yup.string(),
  gender: Yup.object()
    .shape({
      id: Yup.number(),
      name: Yup.string(),
      value: Yup.string(),
    })
    .optional(),
  documentLanguage: Yup.object()
    .shape({
      id: Yup.number(),
      name: Yup.string(),
    })
    .optional(),
  extentOfDocument: Yup.string(),
  otherPhysicalAspects: Yup.string(),
  authenticityMarks: Yup.string(),
  notesOnDocumentOrHolder: Yup.string(),
  relationshipToOtherDocs: Yup.string(),
  informationDigitallyRecordedByFO: Yup.object()
    .shape({
      id: Yup.number(),
      name: Yup.string(),
      value: Yup.boolean(),
    })
    .optional(),
  nameOfDocumentReview: Yup.string(),
  reviewersNotes: Yup.string(),
})

function MetaDataForm({
  onSubmit,
  defaultFormValues = {},
}: {
  defaultFormValues?: Partial<MetaData>
  onSubmit: (values: MetaDataFormInputs) => void
}) {
  const {
    handleSubmit,
    register,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<MetaDataFormInputs & { serverError: string }>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultFormValues,
      includesPhoto:
        defaultFormValues.includesPhoto !== undefined
          ? booleanOptions.find(option => option.value === defaultFormValues.includesPhoto)
          : undefined,
      informationDigitallyRecordedByFO:
        defaultFormValues.informationDigitallyRecordedByFO !== undefined
          ? booleanOptions.find(option => option.value === defaultFormValues.informationDigitallyRecordedByFO)
          : undefined,
      documentType: documentTypes.find(type => type.name === defaultFormValues.documentType) || documentTypes[0],
      gender:
        defaultFormValues.gender !== undefined
          ? genderOptions.find(option => option.value === defaultFormValues.gender)
          : undefined,
      documentLanguage:
        defaultFormValues.documentLanguage !== undefined
          ? documentLanguageOptions.find(option => option.name === defaultFormValues.documentLanguage)
          : undefined,
    },
  })

  const onFormSubmit = handleSubmit(async ({ serverError, ...values }) => {
    try {
      await onSubmit(values)
      // Errors thrown might vary because of arweave-js way of dealing with errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.type) {
        return setError('serverError', { type: 'blockchain error', message: e.type })
      }
      setError('serverError', { type: 'blockchain error', message: e.message })
    }
  })

  return (
    <form className="max-w-6xl w-full mt-4" onSubmit={onFormSubmit}>
      <div className="grid gap-y-2 grid-cols-1">
        <fieldset className="grid gap-y-2 border border-solid border-gray-300 p-3">
          <legend className="font-semibold"> Mandatory fields </legend>

          <TextInput
            errorMessage={errors.fieldOfficer?.message}
            id="fieldOfficer"
            placeholder="Name"
            label="Field Officer"
            required
            {...register('fieldOfficer')}
          />
          <Controller
            control={control}
            name="documentType"
            render={({ field: { value, onChange } }) => (
              <SelectInput required label="Document type" options={documentTypes} setValue={onChange} value={value} />
            )}
          />
          <TextInput
            errorMessage={errors.documentTitle?.message}
            id="documentTitle"
            placeholder="Title"
            label="Document Title"
            required
            {...register('documentTitle')}
          />
          <TextInput
            errorMessage={errors.location?.message}
            id="location"
            placeholder="Country"
            label="Document issuance country"
            required
            {...register('location')}
          />
          <Controller
            control={control}
            name="dateOfScanning"
            render={({ field: { onChange, name, value } }) => (
              <MaskInput
                errorMessage={errors.dateOfScanning?.message}
                id={name}
                name={name}
                label="Date of scanning"
                format="####-##-##"
                placeholder="YYYY-MM-DD"
                mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D']}
                required
                isNumericString
                defaultValue={value?.substr(0, 10).replaceAll('-', '')}
                onValueChange={v => {
                  return onChange(v.formattedValue)
                }}
              />
            )}
          />
          <TextInput
            errorMessage={errors.locationOfScanning?.message}
            id="locationOfScanning"
            placeholder="Location"
            label="Location of scanning"
            required
            {...register('locationOfScanning')}
          />
        </fieldset>

        <fieldset className="grid gap-y-2 border border-solid border-gray-300 p-3">
          <legend className="font-semibold"> Personal information </legend>

          <TextInput
            id="principlePersonNamedOnDoc"
            placeholder="Full name"
            label="Person named or represented in the document"
            {...register('principlePersonNamedOnDoc')}
          />

          <Controller
            control={control}
            name="birthday"
            render={({ field: { onChange, name, value } }) => (
              <MaskInput
                id={name}
                name={name}
                errorMessage={errors.birthday?.message}
                label="Date of birth"
                format="####-##-##"
                placeholder="YYYY-MM-DD"
                defaultValue={value?.substr(0, 10).replaceAll('-', '')}
                mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D']}
                isNumericString
                onValueChange={v => {
                  return onChange(v.formattedValue)
                }}
              />
            )}
          />

          <TextInput
            id="placeOfBirth"
            placeholder="Place of birth"
            label="Place of birth"
            {...register('placeOfBirth')}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange } }) => (
              <SelectInput label="Gender" options={genderOptions} setValue={onChange} value={value} />
            )}
          />

          <TextInput
            id="otherPersonNamedAndRoleOnDoc"
            placeholder="Other person name and role"
            label="Other person name and role"
            {...register('otherPersonNamedAndRoleOnDoc')}
          />
        </fieldset>

        <fieldset className="grid gap-y-2 border border-solid border-gray-300 p-3">
          <legend className="font-semibold"> Document information </legend>
          <TextInput
            id="documentPurpose"
            placeholder="Purpose"
            label="Document purpose"
            {...register('documentPurpose')}
          />
          <TextInput
            id="issuingAuthority"
            placeholder="Issuing Authority"
            label="Issuing Authority"
            {...register('issuingAuthority')}
          />
          <TextInput
            id="nameAndIdNumberOfIssuingOfficer"
            placeholder="Name of issuing officer"
            label="Name of issuing officer"
            {...register('nameAndIdNumberOfIssuingOfficer')}
          />
          <Controller
            control={control}
            name="dateOfIssuance"
            render={({ field: { onChange, name, value } }) => (
              <MaskInput
                id={name}
                name={name}
                label="Date of issuance"
                format="####-##-##"
                placeholder="YYYY-MM-DD"
                errorMessage={errors.dateOfIssuance?.message}
                mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D']}
                defaultValue={value?.substr(0, 10).replaceAll('-', '')}
                isNumericString
                onValueChange={v => {
                  return onChange(v.formattedValue)
                }}
              />
            )}
          />
          <TextInput
            id="placeOfIssuance"
            placeholder="Place/city of issuance"
            label="Place/city of issuance"
            {...register('placeOfIssuance')}
          />
          <Controller
            control={control}
            name="documentLanguage"
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Document language"
                options={documentLanguageOptions}
                setValue={onChange}
                value={value}
              />
            )}
          />
          <TextInput
            id="documentNumber"
            placeholder="Official document number"
            label="Official document number"
            {...register('documentNumber')}
          />
          <TextInput
            id="extentOfDocument"
            placeholder="Pages"
            label="Extent and dimensions of the document"
            {...register('extentOfDocument')}
          />
          <TextInput
            id="authenticityMarks"
            placeholder="Authenticity marks"
            label="Authenticity marks  (e.g. stamps, seals)"
            {...register('authenticityMarks')}
          />
          <TextInput
            id="otherOfficialDates"
            placeholder="Other official dates"
            label="Other official dates (e.g. re-issue, extension, validation)"
            {...register('otherOfficialDates')}
          />
          <Controller
            control={control}
            name="includesPhoto"
            render={({ field: { value, onChange } }) => (
              <SelectInput
                label="Does document includes photograph of person named in document"
                options={booleanOptions}
                setValue={onChange}
                value={value}
              />
            )}
          />
        </fieldset>

        <fieldset className="grid gap-y-2 border border-solid border-gray-300 p-3">
          <legend className="font-semibold"> Other information </legend>

          <TextInput
            id="relationshipToOtherDocs"
            placeholder="Data transaction ID"
            label="Data transaction ID of related document"
            {...register('relationshipToOtherDocs')}
          />
          <TextInput
            id="nameOfDocumentReview"
            placeholder="Name"
            label="Name of person who reviewed data and documents"
            {...register('nameOfDocumentReview')}
          />
          <TextInput
            id="notesOnDocumentOrHolder"
            placeholder="Notes"
            label="Notes by the holder on the document (e.g How do they come to have the document, why is the document important)"
            {...register('notesOnDocumentOrHolder')}
          />
          <TextInput
            id="nameAndIdNumberOfTranslatingParty"
            placeholder="Translator data"
            label="Name, ID number of Translator"
            {...register('nameAndIdNumberOfTranslatingParty')}
          />

          <Controller
            control={control}
            name="informationDigitallyRecordedByFO"
            render={({ field: { value, onChange } }) => (
              <SelectInput
                label="Was information digitally recorded by a FO"
                options={booleanOptions}
                setValue={onChange}
                value={value}
              />
            )}
          />
          <TextInput
            id="otherPhysicalAspects"
            placeholder="Physical aspects"
            label="Other aspects of physical description (e.g., format; medium; condition; notable features)"
            {...register('otherPhysicalAspects')}
          />
          <TextInput id="reviewersNotes" placeholder="Notes" label="Reviewer's notes" {...register('reviewersNotes')} />
        </fieldset>
      </div>
      <div className="mt-8 flex items-center">
        <Button
          className={clsx(isSubmitting && 'disabled:cursor-wait')}
          type="submit"
          disabled={isSubmitting || !isDirty}
        >
          <div className="flex items-center">
            <span>Save to Arweave</span>
            {isSubmitting && <Spinner className="animate-spin ml-2 h-4 w-4 text-white" />}
          </div>
        </Button>
        {errors.serverError && <p className="ml-4 text-red-500 text-xs italic">{errors.serverError.message}</p>}
      </div>
    </form>
  )
}

export { MetaDataForm, MetaDataFormInputs }
