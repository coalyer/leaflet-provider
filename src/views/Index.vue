<template>
  <div>
    这里是index页面，此时登录的用户是{{userName}}
    <AIMap class="gis-box"></AIMap>
  </div>
</template>

<script>
import AIMap from './HomeBaseAIMap/AIMap.vue'
export default {
  name: 'Index',
  components: {
    [AIMap.name]: AIMap,
  },
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