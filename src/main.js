import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 引入路由
import router from './router'
// 引入mock
import './mock.js'
// 引入store
import store from './store/index.js'

import Cookies from 'js-cookie'

Vue.config.productionTip = false

// 设置路由拦截
router.beforeEach((to, from, next) => {
  let name = Cookies.get('name') || store.state.name
  // 如果cookie没有过期或者store中有name值,则允许访问直接通过。否则就让用户登录
  if (name) {
    store.commit('loginIn', name)
    next()
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({
        name: 'Login'
      })
      store.commit('loginOut')
    }
  }
})

router.afterEach(() => { })

Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
