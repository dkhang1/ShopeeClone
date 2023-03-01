import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/ultis.type'
import http from 'src/utils/https'

const URL = '/categories'
const categoryApi = {
  getCategories: () => http.get<SuccessResponse<Category[]>>(URL)
}
export default categoryApi
