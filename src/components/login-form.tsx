import React from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

type FormInputs = {
  username: string
  password: string
}

const schema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

interface LoginFormProps {
  onSubmit: (data: FormInputs) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })

  const passwordErrorMessage = errors.password?.message
  const usernameErrorMessage = errors.username?.message

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div
          className={clsx(
            'md:flex md:items-center rounded border relative',
            usernameErrorMessage
              ? 'mb-2 border-red-400 hover:border-red-500'
              : 'mb-6 border-gray-300 focus-within:border-gray-400 hover:border-gray-400',
          )}
        >
          <input
            className="block bg-gray-100 appearance-none rounded w-full px-4 py-2 text-gray-700 leading-tight focus:outline-none hover:cursor-pointer"
            id="username"
            type="text"
            placeholder=" "
            {...register('username')}
          />
          <label
            className="absolute left-2 top-50 text-gray-400 z-1 font-semibold hover:cursor-pointer origin-0 duration-300"
            htmlFor="username"
          >
            Username
          </label>
        </div>
        {usernameErrorMessage && (
          <div className="mb-4">
            <p className="text-red-500 text-xs italic">{usernameErrorMessage}</p>
          </div>
        )}
      </div>
      <div>
        <div
          className={clsx(
            'md:flex md:items-center rounded border relative',
            passwordErrorMessage
              ? 'mb-2 border-red-400 hover:border-red-500'
              : 'mb-6 border-gray-300 focus-within:border-gray-400 hover:border-gray-400',
          )}
        >
          <input
            className="block bg-gray-100 appearance-none rounded w-full px-4 py-2 text-gray-700 leading-tight focus:outline-none hover:cursor-pointer"
            id="password"
            type="password"
            placeholder=" "
            {...register('password')}
          />
          <label
            className="absolute left-2 top-50 text-gray-400 z-1 font-semibold hover:cursor-pointer origin-0 duration-300"
            htmlFor="password"
          >
            Password
          </label>
        </div>
        {passwordErrorMessage && (
          <div className="mb-4">
            <p className="text-red-500 text-xs italic">{passwordErrorMessage}</p>
          </div>
        )}
      </div>

      <div className="md:flex md:items-center">
        <button
          className="mx-auto w-64 shadow-md bg-orange-500 hover:bg-orange-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  )
}
