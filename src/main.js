import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

// 全局样式表
import "./assets/css/base.css"
import 'element-ui/lib/theme-chalk/index.css';

import {
   Container,
   Header,
   Aside,
   Main,
   Switch,
   Menu,
   MenuItem,
   MenuItemGroup,
   Submenu,
   Carousel,
   CarouselItem,
   Pagination,
   Tabs,
   TabPane,
   Table,
   TableColumn,
   Slider,
   Input,
   Popover,
   Button,
   Form,
   FormItem,
   Message,
   Drawer,
   InfiniteScroll,
   Dialog,
   Link,
   Tooltip,
   Loading,
   Footer,
} from 'element-ui';

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Switch)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Slider)
Vue.use(Input)
Vue.use(Popover)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Drawer)
Vue.use(InfiniteScroll)
Vue.use(Dialog)
Vue.use(Link)
Vue.use(Tooltip)
Vue.use(Loading)
Vue.use(Footer)

Vue.prototype.$message = Message;

// import VueQriously from 'vue-qriously'
// Vue.use(VueQriously);

// 全局请求方法
import { request } from "./utils/request";
Vue.prototype.$request = request;

// 设置全局 cookie 方法
// import Cookies from 'js-cookie'
// Vue.prototype.$cookie = Cookies;

new Vue({
   router,
   store,
   render: h => h(App),
   // mounted() {
   //    document.dispatchEvent(new Event('render-evt'));
   // }
}).$mount('#app');
