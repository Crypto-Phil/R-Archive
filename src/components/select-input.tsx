import React from 'react'
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { InputContainer } from './input-container'

interface SelectOption {
  id: number
  name: string
  value?: string | number | boolean
}

interface SelectInputProps {
  value: SelectOption
  setValue: () => void
  options: SelectOption[]
  label: string
  errorMessage?: string
  required?: boolean
}

function SelectInput({ required, value, setValue, options, label, errorMessage }: SelectInputProps) {
  return (
    <Listbox value={value} onChange={setValue}>
      <InputContainer>
        <Listbox.Label
          className={clsx(
            required && 'required',
            'flex items-center text-sm font-medium text-gray-700 hover:cursor-pointer',
          )}
        >
          {label}
        </Listbox.Label>
        <div className="mt-1 relative col-span-2">
          <Listbox.Button
            className={clsx(
              'relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-2 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm',
              errorMessage
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                : 'focus:ring-orange-500 focus:border-orange-500',
            )}
          >
            <span className="flex items-center">
              <span className="ml-3 block truncate">{value?.name || 'Select option'}</span>
            </span>
            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">↕</span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {options.map(option => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    clsx(
                      active ? 'text-white font-semibold bg-orange-500' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9',
                    )
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                          {option.name}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={clsx(
                            active ? 'text-white font-semibold' : 'text-orange-500',
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                          )}
                        >
                          ✔
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </InputContainer>
    </Listbox>
  )
}

export { SelectInput }
