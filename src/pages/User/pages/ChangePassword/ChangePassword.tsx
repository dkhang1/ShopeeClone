import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/ultis.type'
import { userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>
const changePasswordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))

      toast.success(response.data.message)
    } catch (err) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(err)) {
        const formError = err.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900 '>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mr-auto mt-8 max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className=' mt-6 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right capitalize text-gray-500/80 sm:w-[20%]'>Mật khẩu cũ</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='password'
                type='password'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div className=' mt-3 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right  capitalize text-gray-500/80 sm:w-[20%]'>Mật khẩu mới</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='new_password'
                type='password'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className=' mt-3 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right  capitalize text-gray-500/80 sm:w-[20%]'>Nhập lại mật khẩu</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='confirm_password'
                type='password'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className=' mt-3 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right  capitalize text-gray-500/80 sm:w-[20%]'></div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Button className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
