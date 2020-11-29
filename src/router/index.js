import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/login.vue')
const Home = () => import('components/home.vue')
const Welcome = () => import('components/homeComps/homeMain/Welcome.vue')
const Users = () => import('components/homeComps/users/users.vue')
const Rights = () => import('components/homeComps/power/rootList.vue')
const Roles = () => import('components/homeComps/power/roles.vue')
const Cate = () => import('components/homeComps/goods/Cate.vue')
const Params = () => import('components/homeComps/goods/Params.vue')
const GoodsList = () => import('components/homeComps/goods/List.vue')
const Add = () => import('components/homeComps/goods/Add.vue')
const Order = () => import('components/homeComps/order/order.vue')

Vue.use(VueRouter)

const routes = [{
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { 
        path:'/welcome',
        component: Welcome
      },
      {
        path:'/users',
        component: Users
      },
      {
        path:'/rights',
        component: Rights
      },
      {
        path:'/roles',
        component: Roles
      },
      {
        path:'/categories',
        component: Cate
      },
      {
        path:'/params',
        component: Params
      },
      {
        path:'/goods',
        component: GoodsList
      },
      {
        path:'/goods/add',
        component: Add
      },
      {
        path:'/orders',
        component: Order
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login') 强制跳转

  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
