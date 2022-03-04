import React from 'react'
import clsx from 'clsx'
import { InputContainer, InputLabel } from './input-container'

interface NumberInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  name: string
  id: string
  label?: string
  errorMessage?: string
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ name, label = name, id, errorMessage, ...props }, ref) => {
    return (
      <InputContainer>
        <InputLabel id={id}>{label}</InputLabel>
        <input
          type="number"
          className={clsx(
            'col-span-2 rounded px-4 py-2 leading tight border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-1 hover:cursor-pointer',
            errorMessage
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'focus:ring-orange-500 focus:border-orange-500',
          )}
          ref={ref}
          name={name}
          id={id}
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

NumberInput.displayName = 'NumberInput'

export { NumberInput }
