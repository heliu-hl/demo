import Taro from '@tarojs/taro'
// import qs from 'qs'
import { BASE_URL, HTTP_ERROR } from "../config"

const IS_WEAPP = process.env.TARO_ENV === 'weapp'

/**
 * 检查http状态值
 * @param response
 * @returns {*}
 */
function checkHttpStatus(response) {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    IS_WEAPP && Taro.hideNavigationBarLoading()
    return response.data
  }

  const message = HTTP_ERROR[response.statusCode] || `ERROR CODE: ${response.statusCode}`
  const error = new Error(message)
  error.response = response
  throw error
}

/**
 * 检查返回值是否正常
 * @param data
 * @returns {*}
 */
function checkSuccess(data, resolve) {
  if (typeof data === 'string' && data instanceof ArrayBuffer) {
    return data
  }

  if (typeof data.flag === 'boolean' && data.flag === true) {
    return resolve(data)
  }

  if (typeof data.success === 'number' && data.success === 1) {
    return resolve(data)
  }
  const error = new Error(data.msg || '服务端返回异常')
  error.data = data
  throw error
}

/**
 * 请求错误处理
 * @param error
 * @param reject
 */
function handleError(error, reject) {
  IS_WEAPP && Taro.hideNavigationBarLoading()
  if (error.errMsg) {
    // reject(new Error(JSON.stringify(error)))
    reject(new Error(`服务器正在维护中![${error.errMsg}]`))
  }
  if (!error.message) {
    error.message = '服务器正在维护中!'
  }
  reject(error)
}

export default {
  request(options, method = 'GET') {
    return new Promise((resolve, reject) => {
      const { baseUrl, url, form_type = 'json' } = options
      let requestUrl = `${baseUrl || BASE_URL}${url}`;
      // 加一些公用的参数
      if (!options.defaultValue) {
        //当传入参数为真则不加入默认参数
        options.data = {
          ...options.data,
          os: process.env.TARO_ENV,
        }
      }

      let contentType = 'application/json'
      if (method === 'POST') {
        if (form_type === 'json') {
          contentType = 'application/json'
        } else if (form_type) {
          contentType = 'application/x-www-form-urlencoded'
          // options.data = qs.stringify(options.data)
        }
      }
      IS_WEAPP && Taro.showNavigationBarLoading()
      Taro.request({
        ...options,
        method: method,
        url: requestUrl,
        header: {
          'content-type': contentType,
          ...options.header,
        }
      })
        .then(checkHttpStatus)
        .then((res) => {
          checkSuccess(res, resolve)
        })
        .catch(error => {
          handleError(error, reject)
        })
    })
  },
  get(options) {
    return this.request({
      ...options
    })
  },
  post(options) {
    return this.request({
      ...options
    }, 'POST')
  }
}
