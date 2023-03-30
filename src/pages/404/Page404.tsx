import { Link } from 'react-router-dom'
import { path } from 'src/constants/path'
import icon from '../../assets/error-404.png'
export default function Page404() {
  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <div>
        <img src={icon} alt='404' className='h-28 w-28' />
      </div>
      <div className='mt-4 text-sm text-gray-500'>It looks like something is missing!</div>
      <Link to={path.home} className='mt-4 rounded-sm bg-orange px-3 py-2 text-sm capitalize text-white'>
        trở về trang chủ
      </Link>
    </div>
  )
}
