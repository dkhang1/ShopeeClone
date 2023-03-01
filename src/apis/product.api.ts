import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/ultis.type'
import http from 'src/utils/https'

const URl = '/products'
const productApi = {
  getProducts: (params: ProductListConfig) => http.get<SuccessResponse<ProductList>>(URl, { params }),
  getProductDetail: (id: string) => http.get<SuccessResponse<Product>>(`${URl}/${id}`)
}

export default productApi
