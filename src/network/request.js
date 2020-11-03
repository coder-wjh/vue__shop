import axios from 'axios'


export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    // http://119.23.53.78:8888/api/private/v1
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(
    config => {
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    },err => {
      
  });

  // 2.2.响应拦截
  instance.interceptors.response.use(
    res => {
      return res.data
    },
    err => {
      console.log(err);
    }
  )

  // 3.发送真正的网络请求
  return instance(config)
}