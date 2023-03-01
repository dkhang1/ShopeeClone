import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  classNameInput?: string
  classNameError?: string
}

export default function Input({
  errorMessage,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  name,
  register,
  className,
  rules,
  ...rest
}: Props) {
  const resultRegister = register && name ? register(name, rules) : null
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...resultRegister} />
      {register && <div className={classNameError}>{errorMessage}</div>}
    </div>
  )
}
