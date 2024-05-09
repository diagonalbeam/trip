import Axios from 'axios'
import { getToken, removeToken } from '@/utils/token'
import { toast } from '@/components/Toast/use-toast'

export const axios = Axios.create({
  baseURL: '/api',
})

declare module 'axios' {
  export interface AxiosInstance {
    request<R = any, D = any>(config: AxiosRequestConfig<D>): Promise<R>
    get<R = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    delete<R = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    head<R = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    options<R = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    post<R = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    put<R = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    patch<R = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
  }
}


axios.interceptors.request.use((config) => {
  config.headers.Authorization = getToken()
  return config
})


let redirecting = false

axios.interceptors.response.use((response) => {
  const data = response.data
  return data.data
}, (error) => {
  if (error.response.status === 401) {
    toast({
      title: '登录已过期，请重新登录',
      icon: 'error',
    })
    removeToken()
    if (redirecting) {
      return Promise.reject(error)
    } else {
      redirecting = true
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      return Promise.reject(error)
    }
  }
  return error
})
