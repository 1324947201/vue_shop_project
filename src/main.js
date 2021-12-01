import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import moment from 'moment'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器，向请求头中添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$moment = moment;
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
