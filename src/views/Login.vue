<template>
  <div class="login">
    <div class="l-form">
      <div class="l-tip">leaflet提供商登录</div>
      <a-form ref="form" :model="form">
        <a-form-item>
          <a-input v-model="form.name"></a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model="form.password" type="password"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSubmit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import login from '../api/login.js'
import { message } from "ant-design-vue"
export default {
  name: 'Login',
  data () {
    return {
      form: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      login.submit(this.form).then(res => {
        // console.log('res:', res);
        if (res.data.status === 1) {
          // 将用户信息存储在vuex中
          this.$store.commit('loginIn', this.form.name)
          // 如果登录成功则跳转我index页面
          this.$router.push('/index')
        } else {
          // 使用antD的message组件，显示登录报错信息
          message.error(res.data.message, 5000)
        }
      }).catch(error => {
        message.error(error.message, 5000)
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #000;
  .l-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 300px;
    margin: auto;
    border-radius: 8px;
    background: #fff;
    padding: 20px;
    .l-tip {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .ant-form {
      width: 100%;
      margin: auto;
      margin-top: 20px;
      .ant-form-item {
        button {
          width: 100%;
        }
      }
    }
  }
}
</style>