export type AppRequestTask = wx.RequestTask

export interface HttpRequestConfig extends wx.RequestOptions {
  token (token: AppRequestTask): void 
}

export interface HttpRequestInterceptors {
  request: HttpRequestInterceptors
}

export type HttpInteratorType = 'success' | 'error'

export interface HttpInteratorMap {
  [id: string]: {
    type: HttpInteratorType,
    value: Function
  }
}

export interface HttpInteratorCallback {
  (value: void): void | PromiseLike<void>
}
