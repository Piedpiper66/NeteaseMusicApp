import Vue from 'vue'

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
   MessageBox,
   Drawer,
   InfiniteScroll,
   Dialog,
   Link,
   Tooltip,
   Loading,
   Dropdown,
   DropdownMenu,
   DropdownItem
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Switch)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
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
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.prototype.$message = Message;
Vue.prototype.$messageBox = MessageBox;