import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/ultis.type'
import http from 'src/utils/https'

const URL = '/purchases'

const purchasesApi = {
  addToCart: (body: { product_id: string; buy_count: number }) =>
    http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body),
  getPurchaseLisst: (params: { status: PurchaseListStatus }) =>
    http.get<SuccessResponse<Purchase[]>>(URL, {
      params
    }),
  buyProduct: (body: { product_id: string; buy_count: number }[]) =>
    http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body),
  updatePurchase: (body: { product_id: string; buy_count: number }) =>
    http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body),
  deletePurchase: (purchaseIds: string[]) =>
    http.delete<SuccessResponse<{ deleted_count: number }>>(URL, {
      data: purchaseIds
    })
}

export default purchasesApi
