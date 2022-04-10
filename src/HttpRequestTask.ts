import type { AppRequestTask } from './types/http'

export class HttpRequestTask {
  _task: AppRequestTask

  constructor (task: AppRequestTask) {
    this._task = task
  }

  abort () {
    this._task?.abort()
  }
}