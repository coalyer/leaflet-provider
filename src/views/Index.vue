<template>
  <div>
    这里是index页面，此时登录的用户是{{userName}}
  </div>
</template>

<script>
export default {
  inject: ['AiMapProvider'],
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
  mounted() {
    console.log(this.AiMapProvider,this.AiMapProvider.aimap)
  },
}
</script>

<style lang="scss">
.gis-box {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
</style>