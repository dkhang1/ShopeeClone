import classNames from 'classnames'
import { omit } from 'lodash'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { path } from 'src/constants/path'
import { sortBy, order as orderConstant } from 'src/constants/product'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'

interface Props {
  pageSize: number
  queryConfig: QueryConfig
}

export default function SortProductList({ pageSize, queryConfig }: Props) {
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const page = Number(queryConfig.page)

  const navigate = useNavigate()

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handlePriceSort = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-3 px-5 '>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='text-[#555555]'>Sắp xếp theo</div>
          <button
            className={classNames('h-8 rounded-sm px-4 text-sm capitalize', {
              'bg-orange text-white': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => {
              handleSort(sortBy.createdAt)
            }}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 rounded-sm px-4 text-sm capitalize', {
              'bg-orange text-white': isActiveSortBy(sortBy.view),
              'bg-white text-black': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => {
              handleSort(sortBy.view)
            }}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 rounded-sm px-4 text-sm capitalize', {
              'bg-orange text-white': isActiveSortBy(sortBy.sold),
              'bg-white text-black': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => {
              handleSort(sortBy.sold)
            }}
          >
            Bán chạy
          </button>
          <select
            className={classNames('h-8  rounded-sm px-4 text-left text-sm capitalize outline-none', {
              'bg-orange text-white': isActiveSortBy(sortBy.price),
              'bg-white text-black': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(e) => handlePriceSort(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='bg-white text-black' value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black' value={orderConstant.asc}>
              Giá: Thấp đến Cao
            </option>
            <option className='bg-white text-black' value={orderConstant.desc}>
              Giá: Cao đến Thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 cursor-not-allowed items-center rounded-tl-sm rounded-bl-sm bg-white/60 px-3 hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex h-8 items-center rounded-tr-sm rounded-br-sm bg-white px-3 hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex h-8 cursor-not-allowed items-center rounded-tl-sm rounded-bl-sm bg-white/60 px-3 hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex h-8 items-center rounded-tr-sm rounded-br-sm bg-white px-3 hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
