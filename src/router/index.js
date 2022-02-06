import Vue from 'vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: () => import('../components/Login') },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: () => import('../components/Home'),
    redirect: '/users',
    children: [
      { path: '/welcome', component: () => import('../components/Welcome') },
      { path: '/users', component: () => import('../components/user/Users') },
      { path: '/rights', component: () => import('../components/power/Rights') },
      { path: '/roles', component: () => import('../components/power/Roles') },
      { path: '/categories', component: () => import('../components/goods/Cate') },
      { path: '/params', component: () => import('../components/goods/Params') },
      { path: '/goods', component: () => import('../components/goods/List') },
      { path: '/goods/add', component: () => import('../components/goods/Add') },
      { path: '/orders', component: () => import('../components/order/Order') },
      { path: '/reports', component: () => import('../components/report/Report') },
    ]
  }
]
//创建router实例对象
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