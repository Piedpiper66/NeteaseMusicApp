import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/elementApply'

Vue.config.productionTip = false;

// 全局样式表
import "./assets/css/base.css"

Vue.prototype.$message = Message;

// import VueQriously from 'vue-qriously'
// Vue.use(VueQriously);

// 全局请求方法
import { request } from "./utils/request";
Vue.prototype.$request = request;

new Vue({
   router,
   store,
   render: h => h(App),
}).$mount('#app');
