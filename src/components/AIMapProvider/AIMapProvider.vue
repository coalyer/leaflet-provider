<template>
  <div class="aimap-provider">
    <div class="map-wrap-container" :id="mapId"></div>
  </div>
</template>
<script>
/**
 * 将数据处理和业务逻辑外置，自己只在乎地图的逻辑, 只处理单独的部分
 * 1. 处理下钻和返回逻辑，bus.$emit()通知状态 和 store进行存储
 * 2. 省市区域颜色，本组件只接收参数，不接受嵌入逻辑
 * 3. 地图点击事件，通过bus.$emit('', operationType, data) 来进行分发，需要的组件自己订阅 （订阅发布模式）
 * 4. 加载图层、移除图层，调用本组件的对外方法，不可越权该值和改组件
 * 5. 公告部分通过混入接入，自己需要的逻辑进行单独处理
 * 6. 可以写组件继承此处见，进行逻辑重写
 */
import {
  drillDownConfig,
  defaultBoundaryStyle
} from './AIMapProviderConfig'

export default {
  data () {
    return {
      mapId: null,
      aimap: null
    }
  },
  created () {
    this.mapId = Math.round(new Date())
  },
  methods: {
    /**
     * @description 初始化地图
     * @param {object} config 配置信息
     */
    initAIMap (config = {}) {
      if (this.aimap) {
        this.aimap.remove()
      }
      this.aimap = new Ai.Map(this.mapId, {
        ak: "MTY1MjkMTAwMU1UWTFNamswTURjME16TTVOaU15TmpBME5EWT0_",
        center: [36.54083333333333, 108.92361111111111],
        minZoom: 3,
        maxZoom: 22,
        zoomSnap: 0.25,
        ...config
      })
    },

    loadBoundaryLayer (areaCode, level, config) {

    },
    /**
     * @description 移除边界
     * @param { Number | String } areaCode 行政编码
     * @param { <String> Enum } level country, province, city
     * 
     */
    removeBoundaryLayer (areaCode, level) {

    },
    /**
     * @description 下钻到指定区域, 此工程不会下钻到市辖区行政
     * @param { Number | String } areaCode 行政编码, 全国为100000
     * @param { <String> Enum } level country, province, city
     * @param callback 回调, 利用回调来设置颜色等参数
     */
    drillDown (areaCode, level, callback) {
      let areaList = []
      let defaultColor = '#30354F99'
      let _showCity = drillDownConfig[level]?.showCity ?? false
      let _showCountry = drillDownConfig[level]?.showCountry ?? false
      this.aimap.getAreaCentPoints(areaCode, props => {
        props.forEach(area => {
          areaList.push({
            color: "#ffffff",
            weight: 1,
            opacity: 0.4,
            fillOpacity: 1,
            fillColor: defaultColor,
            areaId: area.id
          })
        })
      })
      let boundaryOptions = {
        data: areaList,
        parentAreaId: areaCode,
        hoverOptions: { color: "white", weight: 2 },
        showCity: _showCity, // 下钻城市
        showCountry: _showCountry, // 下钻区县
        showHoverPolygon: true,
        showShadow: false,
      }
      if (level == 'country') {
        boundaryOptions.chinaBoundOptions = {
          show: true,
          color: 'white',
          opacity: 1,
          weight: 1,
          fillOpacity: 1
        }
      }
      if (this.boundaryLayer) {
        this.aimap.removeLayer(this.boundaryLayer)
      }
      this.boundaryLayer = new Ai.BoundaryLayer(boundaryOptions)
      this.boundaryLayer.onclick()
      this.aimap.addLayer(this.boundaryLayer)
      if (level == 'country') {
        this.aimap.setView([39.810693, 100.310478], 4.75)
      } else {
        this.aimap.fitBounds(this.boundaryLayer.getBounds())
      }
    },
    // 向上钻取
    drillDownReserve () {

    }
  }
}
</script>
<style lang="less" scoped>
</style>