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

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

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
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Vui lòng điền khoảng giá phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Vui lòng điền khoảng giá phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required()
})

export type Schema = yup.InferType<typeof schema>
