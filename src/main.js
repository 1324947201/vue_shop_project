import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import moment from 'moment'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器的对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器，向请求头中添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$moment = moment;
Vue.config.productionTip = false
Vue.component('tree-table', treeTable)
Vue.filter('dateFormat', function (value) {
  return moment(value, 'X').format('YYYY年MM月DD日 hh:mm:ss')
})
Vue.use(VueQuillEditor)

new Vue({
  // el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')
