import axios from 'axios'

const instancd = axios.create({
  // baseURL: 'http://10.2.98.249:8088',
  // baseURL: 'http://10.0.4.16:8088',
  baseURL: 'http://10.2.98.200:8088',
  // baseURL: 'http://10.205.18.110:8087/',
  tiemout: 5000
})

// http request 请求拦截器
instancd.interceptors.request.use(
  config => {
    // 设置token
    // const token = sessionStorage.getItem("token");
    // if (token) {
    //   config.headers["token"] = 'token';
    // }
    config.headers['token'] = atob(sessionStorage.getItem('token'))
    // config.data = JSON.stringify(config.data);

    // // 设置请求头
    // config.headers = {
    //   'Content-Type':'application/x-www-form-urlencoded'
    // }
 // let isImport=sessionStorage.getItem('isImport');
 //    debugger;
 //    if(isImport){
 //      config.headers = {
 //        'Content-Type': 'multipart/form-data'
 //      }
 //    }
    // console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器即异常处理
instancd.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('错误请求')
        break
      case 401:
        console.log('未授权，请重新登录')
        break
      case 403:
        console.log('拒绝访问')
        break
      case 404:
        console.log('请求错误,未找到该资源')
        break
      case 405:
        console.log('请求方法未允许')
        break
      case 408:
        console.log('请求超时')
        break
      case 500:
        console.log('服务器端出错')
        break
      case 501:
        console.log('网络未实现')
        break
      case 502:
        console.log('网络错误')
        break
      case 503:
        console.log('服务不可用')
        break
      case 504:
        console.log('网络超时')
        break
      case 505:
        console.log('http版本不支持该请求')
        break
      default:
        console.log(`连接错误${err.response.status}`)
    }
    // alert('请刷新重试!')
  } else {
    console.log('连接到服务器失败')
  }
  return Promise.resolve(err.response)
})

function httpRequest (data) {
  return instancd.request(data)
}

const request = function (data) {
  return new Promise((resolve, reject) => {
    httpRequest(data)
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
        console.log('❌失败数据==-->', data)
      })
  })
}

export default request
