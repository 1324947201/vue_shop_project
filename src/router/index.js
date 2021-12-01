import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/Users'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/Users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})
//解决重复点击统一路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
//全局前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login')
    return next()
  const token = sessionStorage.getItem('token')
  if (!token)
    return next('/login')
  next()
})

export default router
