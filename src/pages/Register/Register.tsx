import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm, schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/ultis.type'
import { AppContext } from 'src/contexts/app.context'
import { useContext } from 'react'

type FormData = RegisterForm

export default function Register() {
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })
  // const rules = getRules(getValues)

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])

    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='h-[50rem] bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                className={'mt-8'}
                type='email'
                placeholder='Email'
                name='email'
                register={register}
                // rules={rules.email}
                errorMessage={errors.email?.message}
              />
              <Input
                className={'mt-3'}
                type='password'
                placeholder='Password'
                name='password'
                register={register}
                // rules={rules.password}
                errorMessage={errors.password?.message}
              />
              <Input
                className={'mt-3'}
                type='password'
                placeholder='Confirm Password'
                name='confirm_password'
                register={register}
                // rules={rules.confirm_password}
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full rounded-sm bg-orange py-4 px-2 text-center uppercase text-white opacity-70 transition-all hover:opacity-100'
                >
                  Đăng ký
                </button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                  <span className='text-slate-400'>Bạn đã có tài khoản ?</span>
                  <Link to='/login' className='ml-2 font-semibold text-orange'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
