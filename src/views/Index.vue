<template>
  <div>这里是index页面，此时登录的用户是{{userName}}</div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {

    }
  },
  computed: {
    userName () {
      return this.$store.state.name
    }
  },
}
</script>

<style>
</style>