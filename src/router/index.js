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
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
