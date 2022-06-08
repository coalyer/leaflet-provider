<template>
  <div class="home">
    <div class="content">
      <template>
        <ai-map-provider>
          <Index class="scene-center-box" />
        </ai-map-provider>
      </template>
    </div>
  </div>
</template>

<script>
import Index from '../Index'
import AiMapProvider from '@/components/AIMapProvider/AIMapProvider'

export default {
  name: 'Home',
  components: {
    [Index.name]: Index,
    'ai-map-provider': AiMapProvider
  },
  data () {
    return {}
  },
  mounted () { },
  methods: {},
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  position: relative;
}
/*头部*/
.content {
  display: flex;
  position: relative;
  flex-direction: column;
  height: calc(100% - 60px);
  .scene-center-box {
    width: fit-content;
    position: absolute;
    z-index: 9;
    background-color: unset;
  }
  .gis-box {
    width: 100%;
    height: calc(100vh - 64px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  .scene-box {
    z-index: 9;
    height: 0;
  }
}
</style>
