class HttpRequestTask {
    _task;
    constructor(task) {
        this._task = task;
    }
    abort() {
        this._task?.abort();
    }
}

class HttpInterceptors {
    successList = [];
    errorList = [];
    idMap = {};
    id = 0;
    /**
     * 注册回调
     * @param type
     * @param func
     * @returns
     */
    on(type, func) {
        if (typeof func !== 'function')
            return;
        this.idMap[this.id] = { type, value: func };
        this.addCallback(type, func);
        return this.id++;
    }
    off(id) {
        if (typeof id !== "number")
            return;
        const map = this.idMap[this.id];
        if (!map)
            return;
        this.deleteCallback(map.type, map.value);
        delete this.idMap[this.id];
    }
    clear() {
        this.idMap = {};
        this.successList = [];
        this.errorList = [];
    }
    addCallback(type, func) {
        const targetList = type === 'success' ? this.successList : this.errorList;
        targetList.push(func);
    }
    /**
     * 删除队列中的回调
     * @param type
     * @param func
     */
    deleteCallback(type, func) {
        const targetList = type === 'success' ? this.successList : this.errorList;
        const index = targetList.indexOf(func);
        targetList.splice(index, 1);
    }
    run(type, e) {
        const targetList = type === 'success' ? this.successList : this.errorList;
        let p = Promise.resolve(e);
        for (let index = 0; index < targetList.length; index++) {
            p = p.then(targetList[index], targetList[index]);
        }
        return p;
    }
}
class HttpRequestInterceptors extends HttpInterceptors {
    constructor() {
        super();
    }
    use(success) {
        if (typeof success !== 'function')
            return;
        this.on('success', success);
    }
}
class HttpResponseInterceptors extends HttpInterceptors {
    use(success, error) {
        if (typeof success === 'function') {
            this.on('success', success);
        }
        if (typeof error === 'function') {
            this.on('error', error);
        }
    }
}

class HttpRequest {
    // _task: HttpRequestTask
    _baseConfig;
    interceptors;
    constructor(options) {
        this._baseConfig = options;
        this.interceptors = {
            request: new HttpRequestInterceptors,
            response: new HttpResponseInterceptors
        };
    }
    request(options) {
        return new Promise((resolve, rejcet) => {
            const { token: tokenCallback, ...currentOption } = options;
            const requestOption = {
                ...this._baseConfig,
                ...currentOption,
                success: (e) => {
                    const p = this.interceptors.response.run('success', e);
                    resolve(p);
                },
                error: (e) => {
                    const p = this.interceptors.response.run('error', e);
                    rejcet(p);
                }
            };
            const originTask = wx.request(requestOption);
            const requestToken = new HttpRequestTask(originTask);
            tokenCallback(requestToken);
        });
    }
    get() {
    }
    post() {
    }
    delete() {
    }
    put() {
    }
    options() {
    }
    head() {
    }
}

var HttpRequest$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': HttpRequest
});

export { HttpRequest$1 as default };
