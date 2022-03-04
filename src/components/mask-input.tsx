import React from 'react'
import clsx from 'clsx'
import NumberFormat, { NumberFormatPropsBase } from 'react-number-format'
import { InputContainer, InputLabel } from './input-container'

interface MaskedInputProps extends NumberFormatPropsBase {
  label?: string
  name: string
  errorMessage?: string
  id: string
  required?: boolean
}

const MaskInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ required, name, label = name, id, errorMessage, ...props }) => {
    return (
      <InputContainer>
        <InputLabel className={clsx(required && 'required')} id={id}>
          {label}
        </InputLabel>
        <NumberFormat
          className={clsx(
            'col-span-2 rounded px-4 py-2 leading tight border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-1 hover:cursor-pointer',
            errorMessage
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'focus:ring-orange-500 focus:border-orange-500',
          )}
          name={name}
          id={id}
          required={required}
          {...props}
        />
        {errorMessage && (
          <div className="col-start-2 col-span-2 mt-1">
            <p className="text-red-500 text-xs italic">{errorMessage}</p>
          </div>
        )}
      </InputContainer>
    )
  },
)

MaskInput.displayName = 'MaskInput'

export { MaskInput }
