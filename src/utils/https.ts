import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/HttpStatusCode.enum'
import { path } from 'src/constants/path'
import { AuthResponse } from 'src/types/auth.type'
import { clearLocal, getAccessTokenFromLocal, saveAccessTokenToLocal, saveProfileToLocal } from './auth'
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
          if (url === path.login || url === path.register) {
            const result = response.data as AuthResponse
            this.accessToken = result.data.access_token
            saveAccessTokenToLocal(this.accessToken)
            saveProfileToLocal(result.data.user)
          } else if (url === path.logout) {
            this.accessToken = ''
            clearLocal()
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
