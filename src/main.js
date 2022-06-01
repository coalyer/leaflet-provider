import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// 引入路由
import router from './router'
// 引入mock
import './mock.js'

Vue.config.productionTip = false

Vue.use(Antd)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
