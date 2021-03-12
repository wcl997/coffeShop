import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

//将px转rem文件
import 'lib-flexible/flexible'


import VueCookies from 'vue-cookies'

import {
  NavBar,
  Field,
  Button,
  Popup,
  Search,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  SwipeCell,
  Checkbox,
  CheckboxGroup,
  Card,
  SubmitBar,
  List,
  Empty,
  AddressList,
  AddressEdit,
  Icon,
  Tab,
  Tabs,
  Uploader,
  Cell
} from 'vant'
import Axios from 'axios'

Vue
  .use(Cell)
  .use(Uploader)
  .use(Tab)
  .use(Tabs)
  .use(Icon)
  .use(AddressEdit)
  .use(AddressList)
  .use(Empty)
  .use(List)
  .use(SubmitBar)
  .use(Card)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Popup)
  .use(Search)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Toast)
  .use(Stepper)
  .use(SwipeCell)
  .use(Checkbox)
  .use(CheckboxGroup)

  Vue.use(VueCookies)

  axios.interceptors.request.use(config=>{
    if(config.method==='post'){
      let pString = ''
      for(let key in config.data){
        pString+=`${key}=${config.data[key]}&`;
      }

      config.data = pString.slice(0,-1);
      // console.log(config.data)
    }
    return config
  })


Vue.config.productionTip = false

Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='


//定义全局过滤器
Vue.filter('formatDate', (data, format) => {

  let date = new Date(data);

  //获取年份
  let year = date.getFullYear().toString();

  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let yearContent = RegExp.$1;

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;

      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
