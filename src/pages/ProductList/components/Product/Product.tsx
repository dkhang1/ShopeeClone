import { Link } from 'react-router-dom'
import StarRating from 'src/components/StarRating'
import { path } from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumber, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='overflow-hidden rounded-sm bg-white transition-transform duration-100 hover:translate-y-[-0.05rem] hover:shadow-sm'>
        <div className='relative w-full  pt-[100%]'>
          <img
            className='absolute top-0 left-0 h-full w-full bg-white object-cover'
            width='invalid-value'
            height='invalid-value'
            style={{ objectFit: 'contain' }}
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-sm'>₫{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 text-orange'>
              <span className='text-sm'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center'>
            <StarRating rating={product.rating} />
            <div className='ml-2 text-xs'>
              <span className='mr-1'>Đã bán</span>
              <span>{formatNumber(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
