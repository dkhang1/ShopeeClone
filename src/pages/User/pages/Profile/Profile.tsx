import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { userApi } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { saveProfileToLocal } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getAvatarUrl } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'avatar' | 'date_of_birth' | 'phone'>
const profileSchema = userSchema.pick(['name', 'address', 'avatar', 'date_of_birth', 'phone'])
export default function Profile() {
  const [file, setFile] = useState<File>()

  const { setProfile } = useContext(AppContext)
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      avatar: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  const avatar = watch('avatar')

  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1910, 0, 1))
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const response = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(response.data.data)
      saveProfileToLocal(response.data.data)
      refetch()
      toast.success(response.data.message)
    } catch (err) {
      console.log(err)
    }
  })

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900 '>hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex  flex-col  flex-wrap items-start  sm:flex-row '>
            <div className='truncate text-right capitalize text-gray-500/80 sm:w-[20%]'>Email</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>{profile?.email}</div>
          </div>
          <div className=' mt-6 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right capitalize text-gray-500/80 sm:w-[20%]'>tên</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className=' mt-3 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right capitalize text-gray-500/80 sm:w-[20%]'>số điện thoại</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className=' mt-3 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right  capitalize text-gray-500/80 sm:w-[20%]'>địa chỉ</div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />
          <div className=' mt-3 flex flex-col flex-wrap items-start sm:flex-row '>
            <div className='mt-2 truncate text-right  capitalize text-gray-500/80 sm:w-[20%]'></div>
            <div className='w-[100%] sm:w-[80%] sm:pl-5'>
              <Button className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center '>
            <div className='my-5 h-24 w-24 rounded-full'>
              {previewImage || avatar ? (
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='h-full w-full rounded-full bg-orange fill-white stroke-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                  />
                </svg>
              )}
            </div>
            <InputFile onChange={handleChangeFile} />
            <div className='mt-3 text-gray-400'>
              <p>Dụng lượng file tối đa 1MB </p>
              <p>Định dạng:.JPEG, .PNG</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
