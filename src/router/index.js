import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/logsViews.vue')
  },{
    path: '/settingViews',
    name: 'SettingViews',
    component: () => import('../views/settingViews')
  },{
    path: '/readme',
    name: 'Readme',
    component: () => import('../views/readme')
  },{
    path: '/logsCharts',
    name: 'LogsCharts',
    component: () => import('../views/logsCharts')
  },{
    path: '/login',
    name: 'Login',
    component: () => import('../views/login')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * @Description: 路由守卫  判断localstorage是否拥有账号密码
 * @author Wish
 * @date 2020/5/6
*/
router.beforeEach((to, from, next) => {
  if(to.path=="/login"){
    next();
  }else{
    if(localStorage.login){
      next()
    }else{
      next({name:"Login"})
    }
  }

})

export default router
