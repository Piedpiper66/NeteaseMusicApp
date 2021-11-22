import axios from 'axios'
import vuex from '../store/index'

const isDev = process.env.NODE_ENV === 'development';
const envHost = isDev ? 'localhost' : 'www.raoyunfeng.fun'

// 该项目所有请求均为 get请求
export function request(url, params) {
   // 请求超过30秒则判定为超时
   const instance = axios.create({
      baseURL: `http://${envHost}:3000`,
      timeout: 30000,
      withCredentials: true,
   });

   instance.interceptors.request.use(config => {
      return config
   }, err => {
      console.log(err);
   });

   // 响应拦截
   instance.interceptors.response.use(config => {
      return config;
   }, err => {
      console.log([err]);
      if (err.response.data.msg == '需要登录') {
         // token过期 退出登录
         window.localStorage.setItem("userInfo", "");
         // 刷新页面
         history.go(0);
         // 修改当前的登录状态
         vuex.state.isLogin = false;
      } else {
         console.log(err.response.data.msg);
         return err;
      }
   });

   if (params) {
      return instance.get(url, { params });
   } else {
      return instance.get(url);
   }

}