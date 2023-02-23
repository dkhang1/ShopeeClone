import axios, { AxiosError, type AxiosInstance } from 'axios'
import { config } from 'process'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/HttpStatusCode.enum'
import { AuthResponse } from 'src/types/auth.type'
import { clearAccesTokenFromLocal, getAccessTokenFromLocal, saveAccessTokenToLocal } from './auth'
class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLocal()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    ),
      // Add a response interceptor
      this.instance.interceptors.response.use(
        (response) => {
          const { url } = response.config
          if (url === '/login' || url === '/register') {
            this.accessToken = (response.data as AuthResponse).data.access_token
            saveAccessTokenToLocal(this.accessToken)
          } else if (url === '/logout') {
            this.accessToken = ''
            clearAccesTokenFromLocal()
          }
          return response
        },
        function (error: AxiosError) {
          if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data.message || error.message
            toast.error(message)
          }
          return Promise.reject(error)
        }
      )
  }
}
const http = new Http().instance

export default http
