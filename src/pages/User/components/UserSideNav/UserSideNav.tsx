import classNames from 'classnames'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { path } from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  console.log(profile)
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link
          to={path.profile}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-t-black/10'
        >
          {profile?.avatar ? (
            <img src={getAvatarUrl(profile.avatar)} alt='avatar' className='h-full w-full object-cover' />
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-full w-full rounded-full bg-orange fill-white stroke-none'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
              />
            </svg>
          )}
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.name}</div>
          <Link to={path.profile} className='flex items-center capitalize text-[#9B9B9B]'>
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>

            <span>Sửa hồ sơ</span>
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('flex items-center font-medium capitalize transition-colors  hover:text-orange', {
              'text-orange': isActive,
              'text-gray-500': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6 text-[#1458b1]'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
              />
            </svg>
          </div>
          tài khoản của tôi
        </NavLink>
        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            classNames('mt-5 flex items-center font-medium capitalize  transition-colors hover:text-orange', {
              'text-orange': isActive,
              'text-gray-500': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6 text-[#1458b1]'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3'
              />
            </svg>
          </div>
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to={path.purchaseHistory}
          className={({ isActive }) =>
            classNames('mt-5 flex items-center font-medium capitalize transition-colors hover:text-orange', {
              'text-orange': isActive,
              'text-gray-500': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img
              src='https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078'
              alt='purchase'
              className='h-full w-full'
            />
          </div>
          đơn mua
        </NavLink>
      </div>
    </div>
  )
}
