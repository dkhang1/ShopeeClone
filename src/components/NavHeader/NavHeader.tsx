import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import { path } from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'
import Popover from '../Popover'

export default function NavHeader() {
  const queryClient = useQueryClient()

  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const logoutAccountMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutAccountMutation.mutate()
  }

  return (
    <div className='flex justify-end'>
      <Popover
        className='flex cursor-pointer items-center py-1 font-light text-white hover:text-gray-300'
        renderPopover={
          <div className='relative rounded-sm border border-gray-200 bg-white shadow-sm'>
            <div className='flex flex-col py-2 pl-3 pr-28'>
              <button className='py-2 px-2 text-left hover:text-orange'>Tiếng Việt</button>
              <button className='py-2 px-2 text-left hover:text-orange'>English</button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>Tiếng Việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>

      {isAuthenticated && (
        <Popover
          className='ml-6 flex cursor-pointer items-center py-1 font-light text-white hover:text-gray-300'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-sm'>
              <div className='flex flex-col  '>
                <Link to={path.profile} className='p-2 text-left hover:bg-[#fafafa] hover:text-[#00bfa5]'>
                  Tài khoản của tôi
                </Link>
                <button className='p-2 text-left hover:bg-[#fafafa] hover:text-[#00bfa5]'>Đơn mua</button>
                <button onClick={handleLogout} className='p-2 text-left hover:bg-[#fafafa] hover:text-[#00bfa5]'>
                  Đăng xuất
                </button>
              </div>
            </div>
          }
        >
          <div className='mr-2 h-6 w-6 flex-shrink-0'>
            {profile?.avatar ? (
              <img
                className='h-full w-full rounded-full object-cover'
                src={getAvatarUrl(profile?.avatar)}
                alt='avatar'
              />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-full w-full rounded-full bg-white fill-orange stroke-orange'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                />
              </svg>
            )}
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:opacity-70'>
            đăng ký
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40'></div>
          <Link to={path.login} className='mx-3 capitalize hover:opacity-70'>
            đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
