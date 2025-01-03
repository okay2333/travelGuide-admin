import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { message as $message } from 'ant-design-vue'
import router from '@/router'
const service = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    let token = null
    const user = localStorage.getItem('user')
    token = user ? JSON.parse(user) : null
    console.log(token)

    if (token && config.headers) {
      config.headers['Authorization'] = `satoken ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 判断是不是Blob
    console.log("response:@",response)
    if (response.data instanceof Blob) return response.data // 返回了Blob对象
    const { data, message, code } = response.data // 默认json格式
    if (!code) {
      return data
    } else {
      $message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  async (error) => {
    const useStore = useUserStore()
    if (error.response.status === 401) {
      $message.warning('token超时了')
      // 说明token超时了
      useStore.logOut()
      //  主动跳到登录页
      router.push('/login') // 跳转到登录页
      return Promise.reject(error)
    }
    // error.message
    $message.error(error.message)
    return Promise.reject(error)
  }
)
export default service
