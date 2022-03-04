import React from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { InputContainer } from './input-container'

interface DateInputProps {
  value: Date | string | null | undefined
  onChange: (
    date: Date | [Date | null, Date | null] | null,
    event: React.SyntheticEvent<unknown, Event> | undefined,
  ) => void
  label: string
  id: string
}

function DateInput({ id, label, value, onChange }: DateInputProps) {
  const dateValue = typeof value === 'string' ? new Date(value) : value

  return (
    <InputContainer>
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700 hover:cursor-pointer">
        {label}
      </label>
      <div className="col-span-2 w-full">
        <ReactDatePicker
          id={id}
          selected={dateValue}
          onChange={onChange}
          className="w-full rounded px-4 py-2 text-gray-700 leading-tight border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 hover:cursor-pointer"
        />
      </div>
    </InputContainer>
  )
}

export { DateInput }
