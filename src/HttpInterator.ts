import type { HttpInteratorMap, HttpInteratorType, HttpInteratorCallback } from './types/http'

class HttpInterceptors {
  successList: HttpInteratorCallback[] = []
  errorList: HttpInteratorCallback[] = []
  idMap: HttpInteratorMap = {}
  id: number = 0

  /**
   * 注册回调
   * @param type 
   * @param func 
   * @returns 
   */
  on (type: HttpInteratorType , func: HttpInteratorCallback) {
    if (typeof func !== 'function') return
    this.idMap[this.id] =  { type, value: func }
    this.addCallback(type, func)
    return this.id++
  }

  
  off (id: Number) {
    if (typeof id !== "number") return
    const map = this.idMap[this.id]
    if (!map) return
    this.deleteCallback(map.type, map.value)
    delete this.idMap[this.id]
  }

  clear () {
    this.idMap = {}
    this.successList = []
    this.errorList = []
  }


  addCallback (type: HttpInteratorType,  func: HttpInteratorCallback) {
    const targetList = type === 'success' ? this.successList : this.errorList
    targetList.push(func)
  }

  /**
   * 删除队列中的回调
   * @param type 
   * @param func 
   */
  deleteCallback (type: HttpInteratorType,  func: HttpInteratorCallback) {
    const targetList = type === 'success' ? this.successList : this.errorList
    const index = targetList.indexOf(func)
    targetList.splice(index, 1)
  }

  run (type: HttpInteratorType, e: any) {
    const targetList = type === 'success' ? this.successList : this.errorList
    let p = Promise.resolve(e)
    for (let index = 0; index < targetList.length; index++) {
      p = p.then( targetList[index], targetList[index] )
    }
    return p
  }
} 

export class HttpRequestInterceptors extends HttpInterceptors {

  constructor () {
    super()
  }

  use (success: HttpInteratorCallback) {
    if (typeof success !== 'function') return
    this.on('success', success)
  }
}

export class HttpResponseInterceptors extends HttpInterceptors {
  use (success: HttpInteratorCallback, error: HttpInteratorCallback) {
    if (typeof success === 'function') {
      this.on('success', success)
    }
    if (typeof error === 'function') {
      this.on('error', error)
    }
  } 
}

