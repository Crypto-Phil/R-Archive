import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

function Button({ children, className, variant = 'primary', ...rest }: ButtonProps) {
  const variantStyles = {
    primary: 'bg-orange-500 text-white hover:bg-orange-400',
    secondary: 'bg-transparent text-orange-500 border-2 border-orange-400 hover:bg-gray-50 hover:border-orange-500',
  }
  return (
    <button
      type="button"
      className={clsx(
        'text-lg tracking-wide px-4 py-2 rounded-md hover:bg-orange-400 disabled:bg-orange-300',
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export { Button }
