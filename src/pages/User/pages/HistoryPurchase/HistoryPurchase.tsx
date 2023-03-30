import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import purchasesApi from 'src/apis/purchase.api'
import { path } from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParam'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { status: purchaseStatus.all, name: 'Tất cả' },
  { status: purchaseStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchaseStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchaseStatus.inProgress, name: 'Đang giao' },
  { status: purchaseStatus.delivered, name: 'Đã giao' },
  { status: purchaseStatus.canceled, name: 'Đã hủy' }
]

export default function HistoryPurchase() {
  const queryParam: { status?: string } = useQueryParams()
  const status: number = Number(queryParam.status) || purchaseStatus.all

  const { data: purchaseInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchasesApi.getPurchaseLisst({ status: status as PurchaseListStatus })
  })
  const purchaseInCart = purchaseInCartData?.data.data

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
            {purchaseTabs.map((purchaseLink) => (
              <Link
                key={purchaseLink.status}
                to={{
                  pathname: path.purchaseHistory,
                  search: createSearchParams({
                    status: String(purchaseLink.status)
                  }).toString()
                }}
                className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4', {
                  'border-b-orange text-orange': status === purchaseLink.status,
                  'border-b-black/10 text-gray-900': status !== purchaseLink.status
                })}
              >
                {purchaseLink.name}
              </Link>
            ))}
          </div>
          {purchaseInCart && purchaseInCart.length > 1 ? (
            <div>
              {purchaseInCart?.map((purchase) => (
                <div
                  key={purchase._id}
                  className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
                >
                  <Link
                    to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                    className='flex items-center '
                  >
                    <div className='flex-shrink-0'>
                      <img
                        className='h-20 w-20 object-cover'
                        src={purchase.product.image}
                        alt={purchase.product.name}
                      />
                    </div>
                    <div className='ml-3 flex-grow overflow-hidden'>
                      <div className='truncate'>{purchase.product.name}</div>
                      <div className='mt-3'>x{purchase.buy_count}</div>
                    </div>
                    <div className='ml-3 flex-shrink-0'>
                      <span className='truncate text-gray-400 line-through'>
                        ₫{formatCurrency(purchase.price_before_discount)}
                      </span>
                      <span className='ml-2 truncate text-orange '>₫{formatCurrency(purchase.price)}</span>
                    </div>
                  </Link>
                  <div className='flex justify-end'>
                    <div>
                      <span>Tổng giá tiền</span>
                      <span className='ml-4 text-xl text-orange'>
                        ₫{formatCurrency(purchase.price * purchase.buy_count)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='mt-10 flex min-h-[500px] flex-col items-center justify-center bg-white'>
              <img
                src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png'
                alt='no purchase'
                className='h-28 w-28'
              />
              <div className='mt-3 text-sm font-semibold text-gray-500/80'>Chưa có đơn hàng</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
