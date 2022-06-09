import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'

Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    redirect: '/homeNew'
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: "/homeNew",
    name: "HomeNew",
    component: () => import("../views/HomeBaseAIMap"),
  }
]
})

export default router