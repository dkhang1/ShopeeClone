import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginForm, loginSchema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { loginAccount } from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/ultis.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

type FormData = LoginForm

export default function Login() {
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const loginAccountMutation = useMutation({ mutationFn: (body: FormData) => loginAccount(body) })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: () => {
        setIsAuthenticated(true)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  // const rules = getRules()

  return (
    <div className='h-[50rem] bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                className={'mt-8'}
                type='email'
                placeholder='Email'
                name='email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                className={'mt-3'}
                type='password'
                placeholder='Password'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
              />
              <div className='mt-3'>
                <button
                  type='submit'
                  className='w-full rounded-sm bg-orange py-4 px-2 text-center uppercase text-white opacity-70 transition-all hover:opacity-100'
                >
                  Đăng nhập
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-slate-400'>Bạn chưa có tài khoản ?</span>
                <Link to='/register' className='ml-2 font-semibold text-orange'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
