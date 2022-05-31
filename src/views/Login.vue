<template>
  <div>
    <div>leaflet提供商登录</div>
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
</template>

<script>
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
    onSubmit () { }
  }
}
</script>

<style>
</style>