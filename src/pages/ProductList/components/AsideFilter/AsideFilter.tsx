import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { omit } from 'lodash'
import { useForm, Controller } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import { path } from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.type'
import { NoUndefinedField } from 'src/types/ultis.type'
import { Schema, schema } from 'src/utils/rules'
import RatingStartFilter from '../RatingStarFilter'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_max', 'price_min'])

export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const renderCategory = () => {
    return categories.map((categoryItem) => {
      const isActive = category === categoryItem._id
      return (
        <li className='py-2 pl-2' key={categoryItem._id}>
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams(
                omit(
                  {
                    ...queryConfig,
                    category: categoryItem._id
                  },
                  ['page']
                )
              ).toString()
            }}
            className={classNames('relative px-2 ', {
              'font-semibold text-orange': isActive
            })}
          >
            {isActive && (
              <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-orange'>
                <polygon points='4 3.5 0 0 0 7' />
              </svg>
            )}
            {categoryItem.name}
          </Link>
        </li>
      )
    })
  }

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_max', 'price_min', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-4 '>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>{renderCategory()}</ul>

      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='mr-3 h-4 w-3 '
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
          />
        </svg>
        bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-center'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ TỪ'
                    classNameError='disabled'
                    classNameInput='p-1 w-full rounded-sm border border-gray-300  outline-none focus:border-gray-500 focus:shadow-sm'
                    // {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />

            <div className='mx-2  shrink-0'> - </div>
            <Controller
              name='price_max'
              control={control}
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ ĐẾN'
                    classNameError='disabled'
                    classNameInput='p-1 w-full rounded-sm border border-gray-300  outline-none focus:border-gray-500 focus:shadow-sm'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-xs text-red-600'>{errors.price_min?.message}</div>
          <Button className=' flex w-full items-center justify-center rounded-sm bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStartFilter queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        className='flex w-full items-center justify-center rounded-sm bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
        onClick={handleRemoveAll}
      >
        xóa tất cả
      </Button>
    </div>
  )
}
