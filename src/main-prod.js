import App from './App.vue'
import './assets/css/global.css'
import router from './router'
//树形图包
import treeTable from 'vue-table-with-tree-grid'
// import Vue from 'vue'
// import router from './router'
// import './plugins/element.js'
// import axios from 'axios'
// import moment from 'moment'
//富文本编辑器包及其对应样式
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 进度条包及其对应样式
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'


axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//axios请求拦截器，向请求头中添加token，并展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
//在响应拦截器中，关闭进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
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
