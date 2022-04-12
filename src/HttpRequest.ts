import type { HttpRequestConfig } from './types/http'
import { HttpRequestTask } from './HttpRequestTask'
import { HttpRequestInterceptors, HttpResponseInterceptors } from './HttpInterator'

export default class HttpRequest {
  // _task: HttpRequestTask
  _baseConfig: HttpRequestConfig

  interceptors: {
    request: HttpRequestInterceptors;
    response: HttpResponseInterceptors
  }

  constructor (options: HttpRequestConfig) {
    this._baseConfig = options
    this.interceptors = {
      request: new HttpRequestInterceptors,
      response: new HttpResponseInterceptors
    }
  }

  request (options: HttpRequestConfig) {
    return new Promise((resolve, rejcet) => {
      const { token: tokenCallback, ...currentOption } = options
      const requestOption = {
        ...this._baseConfig, 
        ...currentOption,
        success: (e: any) => {
          const p = this.interceptors.response.run('success', e)
          resolve(p)
        },
        error: (e: any) => {
          const p = this.interceptors.response.run('error', e)
          rejcet(p)
        }
      }
      const originTask = wx.request(requestOption)
      const requestToken = new HttpRequestTask(originTask)
      tokenCallback(requestToken)
    })
  }

  get () {

  }

  post () {

  }

  delete () {

  }

  put () {

  }

  options () {

  }

  head () {

  }
}