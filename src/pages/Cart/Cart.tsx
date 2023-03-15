import { useMutation, useQuery } from '@tanstack/react-query'
import produce from 'immer'
import { keyBy } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchasesApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, formatNumber, generateNameId } from 'src/utils/utils'

export default function Cart() {
  const { extendedPurchase, setEtendedPurchase } = useContext(AppContext)
  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchasesApi.getPurchaseLisst({ status: purchaseStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchasesApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductMutation = useMutation({
    mutationFn: purchasesApi.buyProduct,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchasesApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const purchaseInCart = purchaseInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchase.every((purchase) => purchase.checked), [extendedPurchase])
  const checkedPurchases = useMemo(() => extendedPurchase.filter((purchase) => purchase.checked), [extendedPurchase])
  const checkedPurchaseCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.buy_count * current.price
      }, 0),
    [checkedPurchases]
  )
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.buy_count * (current.price_before_discount - current.price)
      }, 0),
    [checkedPurchases]
  )

  const location = useLocation()
  const choosenPurchaseIdFormLocation = (location.state as { purchaseId: string } | null)?.purchaseId

  useEffect(() => {
    setEtendedPurchase((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')

      return (
        purchaseInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFormLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseInCart, choosenPurchaseIdFormLocation, setEtendedPurchase])
  // khi reset hủy state của location
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setEtendedPurchase((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, disable: boolean) => {
    if (disable) {
      const purchase = extendedPurchase[purchaseIndex]
      setEtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      console.log(purchase)
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setEtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchase[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleMultiDelete = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductMutation.mutate(body)
    }
  }

  return (
    <div className='relative bg-[#f5f5f5] py-16'>
      <div className='container'>
        {!purchaseInCart || purchaseInCart.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-2'>
            <img
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
              alt='no purchase'
              className='h-28 w-28'
            />
            <div className='mt-3 text-sm font-semibold text-gray-500/80'>Giỏ hàng của bạn còn trống</div>
            <Link
              to={path.home}
              className='mt-4 flex items-center justify-center rounded-sm bg-orange px-10 py-2 text-center font-light  uppercase text-white transition-all hover:bg-orange/80'
            >
              Mua ngay
            </Link>
          </div>
        ) : (
          <div>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm py-5 shadow-sm'>
                  {extendedPurchase.map((purchase, index) => {
                    return (
                      <div
                        className='grid grid-cols-12 items-center rounded-sm border-t-2 bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow first:border-t-0'
                        key={purchase._id}
                      >
                        <div className='col-span-6'>
                          <div className='flex items-center'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-5 accent-orange'
                                checked={purchase.checked}
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className='flex-grow '>
                              <div className='flex'>
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                >
                                  <img
                                    src={purchase.product.image}
                                    alt={purchase.product.name}
                                    className='h-20 w-20 max-w-none flex-shrink-0 object-cover'
                                  />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2'>
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center text-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center gap-3'>
                                <div className='text-sm text-gray-500 line-through'>
                                  ₫{formatCurrency(purchase.price_before_discount)}
                                </div>
                                <div className='text-sm text-black'>₫{formatCurrency(purchase.price)}</div>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                classNameWrapper=' '
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value <= purchase.product.quantity &&
                                      value >= 1 &&
                                      value !== (purchaseInCart as unknown as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='col-span-1 '>
                              <div className='text-sm text-orange'>
                                ₫{formatCurrency(purchase.buy_count * purchase.price)}
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='border-none bg-none text-sm transition-colors hover:text-orange'
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 flex items-center rounded-sm bg-white p-5 shadow'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input
                  type='checkbox'
                  className='h-5 w-5 accent-orange'
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                />
              </div>
              <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedPurchase.length})</button>
              <button className='mx-3 border-none bg-none' onClick={handleMultiDelete}>
                Xóa
              </button>
              <div className='ml-auto flex items-center'>
                <div>
                  <div className='flex items-center justify-end'>
                    <div>Tổng thanh toán ({checkedPurchaseCount || 0} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center justify-end text-sm'>
                    <div className='mr-3 text-gray-500'>Tiết kiệm</div>
                    <div className='text-orange'>₫{formatNumber(totalCheckedPurchaseSavingPrice).toLowerCase()}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchase}
                  disabled={buyProductMutation.isLoading}
                  isLoading={buyProductMutation.isLoading}
                  className='ml-5 flex h-12 w-52 items-center justify-center rounded-sm bg-orange  text-center uppercase text-white transition-all hover:bg-orange/80'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
