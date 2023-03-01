import http from 'src/utils/https'

const URL = '/purchases'

export const purchasesApi = {
  addToCart: (body: { product_id: string; buy_count: number }) => http.post(`${URL}/add-to-cart`, body)
}
