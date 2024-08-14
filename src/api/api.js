import axios from 'axios'
import { showConfirmDialog, showNotify } from 'vant'
import router from '@/router'

axios.interceptors.response.use(
  res => {
    if(res.data.code === 200){
      return Promise.resolve(res)
    }else if(res.data.code === 100103){
      router.push("/login")
    }else if(res.data.code === 10310){
      showConfirmDialog({
        title: '友情提示',
        message: "下载器尚未配置或启用，是否前往配置",
      }).then(() => {
        router.push("/setting")
      });
    }else {
      showNotify({
        message: res.data.msg,
      })
    }
    return Promise.reject(res)
  },
  error => {

    return Promise.reject(error)
  }
)

export class api {
  static async get (url, params) {
    return await axios.get(url, {
      params: params,
    })
  }

  static async post (url, params) {
    return await axios.post(url, {
      ...params
    })
  }
}
