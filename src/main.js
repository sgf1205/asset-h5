import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/'
import "u-reset.css";

import './filters';

//定义全局http请求工具
import Api from '@/libs/api'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VCharts from "v-charts";
Vue.use(VCharts);

Vue.config.productionTip = false
Vue.prototype.$api = Api


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


