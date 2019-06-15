import axios from 'axios'
import router from '@/router'
import {getToken, setToken, delToken} from '@/libs/util'
import {Modal} from 'iview'

// import { Spin } from 'iview'
class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }

  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 头部携带 token
      let token = getToken()
      if (token) {
        config.headers['Authorization'] = token
      }
      // config.headers['Authorization'] = getToken() || 'douanquan'
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
      let token = res.headers.authorization
      if (token) {
        // 如果 header 中存在 token，那么就替换本地的 token
        setToken(token)
      }
      if (res.data.errorCode == 400) {
        Modal.confirm({
          title: '提示',
          content: '身份已过期，请重新登录',
          onOk: () => {
            delToken() //删除token
            //跳转登录
            router.replace({
              path: '/login'
            })
          },
          onCancel: () => {
            return false
          }
        });
      }

      this.destroy(url)
      const {data, status} = res
      return {data, status}

    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    let result = instance(options);
    return result;
  }
}

export default HttpRequest
