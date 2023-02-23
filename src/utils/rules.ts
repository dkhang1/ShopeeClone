// import { type RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

// validate with react-hook-form
// type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

// export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
//   email: {
//     required: { value: true, message: 'Email là bắt buộc !' },
//     pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không đúng định đạng' }
//   },
//   password: {
//     required: { value: true, message: 'Mật khẩu là bắt buộc !' },
//     maxLength: { value: 160, message: 'Độ dài từ 6 - 160 kí tự' },
//     minLength: { value: 5, message: 'Độ dài từ 6 - 160 kí tự' }
//   },
//   confirm_password: {
//     required: { value: true, message: 'Nhập lại mật khẩu !' },
//     maxLength: { value: 160, message: 'Độ dài từ 6 - 160 kí tự' },
//     minLength: { value: 5, message: 'Độ dài từ 6 - 160 kí tự' },
//     validate:
//       typeof getValues === 'function' ? (value) => value === getValues('password') || 'Mật khẩu không khớp' : undefined
//   }
// })

// validate with yup
export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc !')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc !')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Mật khẩu là bắt buộc !')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
})

const registerSchema = schema
export const loginSchema = schema.omit(['confirm_password'])

export type LoginForm = yup.InferType<typeof loginSchema>
export type RegisterForm = yup.InferType<typeof registerSchema>
