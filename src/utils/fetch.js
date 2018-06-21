// import storage from '../utils/storage'
import axios from 'axios'
import { baseUrl, loginUrl } from './index'
import md5 from 'md5'
let fetcher = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  transformRequest: [function (data) {
    // const userInfo = storage.get('user')
    // if (userInfo && data && !data.NOUSERINFO) {
    //   data.userName = userInfo.userName
    //   data.accessToken = userInfo.accessToken
    // }
    return JSON.stringify(data)
  }],
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
})
fetcher.interceptors.request.use(function (config) {
  const currTime = (new Date()).valueOf()
  config.headers.randomKey = currTime
  config.headers.secretKey = md5(currTime + 'Wivy45YNgsteznpf')
  return config
}, function (error) {
  return Promise.reject(error)
})
fetcher.interceptors.response.use(function (response) {
  if (response.data.code === 20011) {
    window.location.href = loginUrl
  }
  return response.data
}, function (error) { // 这里是返回状态码不为200时候的错误处理
  if (error && error.response) {
    switch (error.response.status) {
      // case 400:
      //   error.errmsg = '请求错误'
      //   break
      //
      // case 401:
      //   error.errmsg = '未授权，请登录'
      //   break
      //
      // case 403:
      //   error.errmsg = '拒绝访问'
      //   break
      //
      // case 404:
      //   error.errmsg = `请求地址出错: ${error.response.config.url}`
      //   break
      //
      // case 408:
      //   error.errmsg = '请求超时'
      //   break
      //
      // case 500:
      //   error.errmsg = '服务器内部错误'
      //   break
      //
      // case 501:
      //   error.errmsg = '服务未实现'
      //   break
      //
      // case 502:
      //   error.errmsg = '网关错误'
      //   break
      //
      // case 503:
      //   error.errmsg = '服务不可用'
      //   break
      //
      // case 504:
      //   error.errmsg = '网关超时'
      //   break
      //
      // case 505:
      //   error.errmsg = 'HTTP版本不受支持'
      //   break

      default:
        error.errmsg = '请联系管理员'
    }
  }
  return Promise.reject(error)
})

export default fetcher
