<template>
  <div class="aimap-provider">
    <div class="map-wrap-container" :id="mapId"></div>
    <slot></slot>
    <slot name="legend"></slot>
    <div class="zoom-tool">
      <div class="zoom-item" style="border-bottom:1px solid lightgray;">
        <a-icon type="plus" @click="changeZoom(1)"></a-icon>
      </div>
      <div class="zoom-item">
        <a-icon type="minus" @click="changeZoom(-1)"></a-icon>
      </div>
    </div>
    <map-tool v-if="regionInfo.level=='city'"></map-tool>
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
import defaultConfig from './AIMapProviderConfig.js'
import MapTool from './ToolWrap.vue'

export default {
  components: {
    'map-tool': MapTool,
  },
  data () {
    return {
      mapId: null, // 地图id
      aimap: null, // 地图实例
      baseLayer: null, // 地图底图
      regionInfo: { // 当前下钻的区划信息
        level: 'country',
        code: '100000',
        name: '全国'
      },
      regionInfoPath: { // 当前下钻的区划的路径
        country: { level: 'country', code: '100000', name: '全国' },
        province: {},
        city: {}
      },
      aimapConfig: {
        zoom: 4.5,
      },
      WMSLayerMap: null,
      FeatureLayerMap: null,
    }
  },
  provide () {
    return {
      AiMapProvider: this,
    }
  },
  created () {
    this.mapId = Math.round(new Date()).toString()
  },
  mounted () {
    this.initAIMap()
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
        zoomSnap: 0.25
      })
      this.loadBaseLayer()
      this.drillDown('100000', 'country', '全国')
    },
    loadBaseLayer () {
      this.baseLayer = Ai.TileLayer("http://10.1.208.56:19081/aichinamap/rest/services/ChinaOnlineCommunity/MapServer")
      this.aimap.addLayer(this.baseLayer)
    },
    /**
     * @description 下钻到指定区域, 此工程不会下钻到市辖区行政
     * @param { Number | String } areaCode 行政编码, 全国为100000
     * @param { <String> Enum } level country, province, city
     * @param callback 回调, 利用回调来设置颜色等参数
     */
    drillDown (areaCode, level, config = {}) {
      let { defaultColor = '#0085D0', optionsData = [] } = config
      let areaList = []
      let _showCity = false
      let _showCountry = false
      this.aimap.getAreaCentPoints(areaCode, props => {
        props.forEach(area => {
          let _Area = optionsData.find(item => item.id == area.id) || {}
          areaList.push({
            color: "#ffffff",
            weight: 1,
            opacity: 0.4,
            fillOpacity: 1,
            fillColor: defaultColor,
            ..._Area,
            areaId: area.id,
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
        showLabel: true,
        labelOptions: {
          lableClassName: 'region-name-label'  // attention: 就是lableClassName，拼写就是错误的
        },
        showShadow: false,
        onClick: e => {
          this.boundaryLayerClick(e)
        }
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
      this.aimap.addLayer(this.boundaryLayer)
      if (level == 'country') {
        this.aimap.setView([39.810693, 100.310478], 4.75)
      } else {
        this.aimap.fitBounds(this.boundaryLayer.getBounds())
      }
    },
    // 向上钻取, 返回按钮用到
    drillDownReserve () {
      if (this.regionInfo.level == 'country') {
        return
      }
      let nextLevel = this.getRegionLevel(this.regionInfo.level, -1)
      let { code, name, level } = this.regionInfoPath[nextLevel]
      this.regionInfo.code = code
      this.regionInfo.name = name
      this.regionInfo.level = level
      this.drillDown(code, level)
      // TODO: 市区返回上一级
    },
    /**
     * @description 下钻到指定区域并设置其颜色的颜色
     * @param areaConfig
     */
    setRegionColor (areaConfig = {}) {
      // Attention 配置必须一致
      let {
        code = this.regionInfo.code,
        level = this.regionInfo.level,
        defaultColor = '#0085D0',
        data = []
      } = areaConfig
      this.drillDown(code, level, {
        defaultColor: defaultColor,
        optionsData: [{
          id: '630000',
          fillColor: 'red'
        }]
      })
      /**
       * optionsDataItem:
       *    color:边框颜色
       *    opacity: 边框透明度
       *    fillColor: 填充的颜色，
       *    fillOpacity: 填充透明度
       *    weight: 宽度，
       *    id: 区域id, 必需
       */
    },
    /**
     * @description 加载图层，如有，则不加载，如无则加载
     * @param { Array } layers 图层数组
     */
    loadWmsLayers (layers) {
      // 循环加载图层，如有则不加载，如无，则加载
      layers.forEach(layer => {
        let wmsLayer = this.WMSLayerMap.get(layer.name)
        if (wmsLayer && !this.aimap.hasLayer(wmsLayer)) {
          this.aimap.addLayer(wmsLayer)
        } else if (!wmsLayer) {
          let newWmsLayer = new Ai.WMSLayer(layer.uri, {
            layers: layer.layerName,
            format: 'image/png',
            transparent: true,
            CQL_FILTER: layer.cql
          })
          this.WMSLayerMap.set(layer.name,)
          this.aimap.addLayer(newWmsLayer)
        }
      })
    },
    /**
     * @description 移除图层，如有，则移除，如无则不处理；为提升性能，暂不频繁处理图层
     * @param { Array } layers 图层数组
     */
    removeWmsLayers (layers) {
      // 循环加载图层，如有则不加载，如无，则加载
      layers.forEach(layer => {
        let wmsLayer = this.WMSLayerMap.get(layer.name)
        if (wmsLayer && this.aimap.hasLayer(wmsLayer)) {
          this.aimap.removeLayer(wmsLayer)
        }
      })
    },
    /**
     * @description 销毁图层，建议在
     */
    destroyWmsLayer () {
      this.WMSLayerMap.forEach((val, key) => {
        if (this.aimap.hasLayer(val)) {
          this.aimap.removeLayer(val)
        }
      })
      this.WMSLayerMap.clear()
    },
    // 边界点击，根据级别和直辖市来区分是否需要下钻
    boundaryLayerClick (e) {
      this.regionInfo.code = e.id
      this.regionInfo.name = e.name
      this.regionInfo.level = this.getRegionLevel(this.regionInfo.level, 1)
      this.setRegionPath()
      let municipalities = ['北京', '上海', '成都', '天津']
      if (this.regionInfo.level == 'city' || municipalities.includes(e.name)) {
        this.aimap.setView(e.cp.reverse(), 11)
        if (this.boundaryLayer) {
          this.aimap.removeLayer(this.boundaryLayer)
        }
      } else {
        this.drillDown(e.id, this.regionInfo.level)
      }
    },
    // 下面的为工具函数，后续抽离
    getRegionLevel (level, addon = 0) {
      let levelConfig = ['country', 'province', 'city', 'district']
      let index = levelConfig.indexOf(level)
      let nextLevel = index + parseInt(addon)
      nextLevel = nextLevel < 0 ? 0 : nextLevel > 3 ? 3 : nextLevel
      return levelConfig[nextLevel]
    },
    setRegionPath () {
      this.$set(this.regionInfoPath, this.regionInfo.level, { ...this.regionInfo })
    },
    changeZoom (change) {
      let zoom = this.aimap.getZoom() + change
      if (3 <= zoom && zoom <= 22) {
        this.aimap.setZoom(zoom)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.aimap-provider,
.map-wrap-container {
  height: 100%;
  width: 100%;
  position: absolute;
}

.zoom-tool {
  position: absolute;
  display: inline-block;
  right: 24px;
  bottom: 24px;
  z-index: 2;
  width: 32px;
  height: 65px;
  background: #fff;
  color: #0085d0;
}
.zoom-tool .zoom-item {
  display: inline-block;
  height: 32px;
  width: 32px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
}
</style> 
<style>
/* .region-name-label {
    color: white;
  } */
</style>