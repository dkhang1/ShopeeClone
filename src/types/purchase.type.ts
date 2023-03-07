import { Product } from './product.type'

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
/** 
-1 sản phẩm trong giỏ hàng
 1 đang đợi xác nhận
 2 đang được lấy hàng
 3 đang được vận chuyển
 4 đã được giao 
 5 bị hủy
 * */

export type PurchaseListStatus = PurchaseStatus | 0

export interface Purchase {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: PurchaseStatus
  user: string
  product: Product
  createdAt: string
  updatedAt: string
}

export interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
}
