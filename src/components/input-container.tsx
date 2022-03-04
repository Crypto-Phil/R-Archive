import React from 'react'
import clsx from 'clsx'

interface InputContainerProps {
  children: React.ReactNode
}

const InputContainer = ({ children }: InputContainerProps) => {
  return <div className="grid grid-cols-3 gap-x-2">{children}</div>
}

interface InputLabelProps {
  children: React.ReactNode
  id: string
  className?: string
}

const InputLabel = ({ children, id, className }: InputLabelProps) => {
  return (
    <label
      className={clsx('flex items-center hover:cursor-pointer text-sm font-medium text-gray-700', className)}
      htmlFor={id}
    >
      {children}
    </label>
  )
}

export { InputContainer, InputLabel }
