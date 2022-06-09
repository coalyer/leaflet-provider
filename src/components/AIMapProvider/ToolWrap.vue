<script>
import MapTool from './Tool.vue'
export default {
  props: ['level'],
  inject: ['AiMapProvider'],
  components: { MapTool },
  render: h => {
    if (level == 'province') {
      return (<a-button
        style="padding: 0"
        class="gis-btn--layers fe-flex-center fe-box fe-bd cursor-pointer"
        on-click={() => { this.AiMapProvider.drillDownReserve() }}
      >
        <i class="fe-icon fe-icon-back"></i>
      </a-button>
      )
    } else if (level == 'city') {
      return <MapTool></MapTool>
    }
  }
}
</script>
<style lang="scss" scoped>
.gis-btn--layers {
  color: #ebebeb;
}
.fe-icon {
  display: inline-block;
  background-size: cover;
}
.fe-icon-back {
  width: 32px;
  height: 32px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zLjY4OCA4LjU2NkwwIDQuNzQzIDMuNjg4IDFsLjk2NS44NDQtMi44NTggMi44OTkgMi44NTggMi45NC0uOTY1Ljg4M3pNMTUgMTQuNjg0aC00Ljg5OHYtMS4yOGgzLjU3M3YtOC4xMkgxLjEyMnYtMS4zN0gxNXYxMC43N3ptLTkuNzk2LTEuMjYySDguNDd2MS4yNjJINS4yMDR2LTEuMjYyeiIgZmlsbD0iI0Q4RDhEOCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPjwvZz48L3N2Zz4=')
    no-repeat center;
}
.ant-btn:hover {
  transition: none;
}
</style>