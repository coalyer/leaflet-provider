<template>
  <div class="map-wrap">
    <div class="map-wrap-container" :id="mapId"></div>
    <div class="tool-list">
      <!-- TODO：后续改为使用插槽来实现不同的图层数据管理 -->
      <a-button type="link" @click="backLevel">
        <i class="fe-icon fe-icon-back"></i>
      </a-button>
    </div>
    <BusStoreAdapter></BusStoreAdapter>
  </div>
</template>
<script>

import { getChinaMapProvinceBM } from './mapUtils'
import Bus from '../../utils/Bus'
import BusStoreAdapter from './BusStoreAdapter'


export default {
  name: 'AIMap',
  components: { BusStoreAdapter },
  data () {
    return {
      mapId: null,
      aimap: null,
      baseLayer: null,
      chinaBoundLayer: null,
      boundaryLayer: null,
      provinceBoundLayer: null,
      provinceList: [],
      provinceListStyle: [],
      regionInfo: {
        areaLevel: 'country', // 当前下钻的级别
        areaName: '全国',
        provinceCode: '', // 省区域编码
        provinceName: '', // 省名称
        cityCode: '', // 市编码
        cityName: '', // 市名称
        currentCode: 100000
      }
    }
  },
  watch: {
    regionInfo: {
      handler (val) {
        Bus.$emit('areaChange', val)
      },
      deep: true
    }
  },
  created () {
    this.mapId = Math.round(new Date()).toString()
    this.provinceList = getChinaMapProvinceBM()
  },
  mounted () {
    this.initMap()
  },
  beforeDestroy () {
    this.aimap.remove()
  },
  methods: {
    initMap () {
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

      this.drillDown()
    },
    resetReginBoundStyle () {

    },
    loadWmstLayer () {

    },
    // 返回下一级
    backLevel () {
      let { areaLevel, provinceCode } = this.regionInfo
      if (areaLevel == 'country') {
        return
      } else if (areaLevel == 'province') {
        this.regionInfo.areaLevel = 'country'
        this.regionInfo.areaName = '全国'
        this.regionInfo.provinceCode = ''
        this.regionInfo.provinceName = ''
        this.regionInfo.cityCode = ''
        this.regionInfo.cityName = ''
        this.regionInfo.currentCode = 100000
        this.initMap()
      } else if (areaLevel == 'city') {
        this.regionInfo.areaLevel = 'province'
        this.regionInfo.areaName = this.regionInfo.provinceName
        this.regionInfo.cityCode = ''
        this.regionInfo.cityName = ''
        this.regionInfo.currentCode = this.regionInfo.provinceCode
        this.aimap.hideAreaBounds(provinceCode)
        let _this = this
        let fillColor = ["#4692e4", "#4b95e4", "#1261d7", "#3584df", "#509ae6", "#428ee3", "#96cef3", "#3c8ae2", "#82c1ef", "#7dbdeb", "#b3e1f7", "#4692e4", "#549dee"]
        let cities = new Array() //构造渲染图层需要的省份样式数据
        _this.aimap.getAreaCentPoints(provinceCode, function (pros) {
          var i = 0
          pros.forEach(function (item) {
            i++
            var id = item.id
            var city = {}
            if (fillColor.length > i) {
              city = { color: "white", fillOpacity: 0.2, fillColor: fillColor[i], areaId: id, weight: 1 }
            } else {
              city = { color: "white", fillOpacity: 0.2, fillColor: fillColor[1], areaId: id, weight: 1 }
            }
            cities.push(city)
          })
        })
        var cities_options = {
          data: cities,
          hoverOptions: { color: "white", weight: 2 },
          parentAreaId: _this.regionInfo.provinceCode,
          showLabel: false,//是否显示标签，默认不显示        
          labelOptions: {
            labelClassName: "labelClass",
            size: [80, 5]
          },
          showCity: false,//点击省份的时候是否下钻城市
          showCountry: false,//点击城市的时候是否下钻区县
          showHoverPolygon: true,
          showShadow: false,
          onClick: function (e) {
            _this.regionInfo.currentCode = e.id
            _this.regionInfo.areaLevel = 'city'
            _this.regionInfo.areaName = e.name
            _this.regionInfo.cityCode = e.id
            _this.regionInfo.cityName = e.name
            _this.aimap.removeLayer(_this.provinceBoundLayer)
            if (!this.baseLayer) {
              _this.baseLayer = Ai.TileLayer("http://10.1.208.56:19081/aichinamap/rest/services/ChinaOnlineStreetPurplishBlue/MapServer")
            }
            _this.aimap.addLayer(this.baseLayer)
            _this.aimap.setView(e.cp.reverse(), 11)
          }
        }
        //渲染钻取的省份图层
        // _this.aimap.removeLayer(_this.chinaBoundLayer)
        _this.provinceBoundLayer = new Ai.BoundaryLayer(cities_options)
        _this.aimap.addLayer(_this.provinceBoundLayer)
        _this.aimap.fitBounds(_this.provinceBoundLayer.getBounds())
      }
    },
    // 设置下钻
    drillDown () {
      let _this = this
      let fillColor = ["#4692e4", "#4b95e4", "#1261d7", "#3584df", "#509ae6", "#428ee3", "#96cef3", "#3c8ae2", "#82c1ef", "#7dbdeb", "#b3e1f7", "#4692e4", "#549dee"]
      let options = {
        data: this.provinceList,
        hoverOptions: { color: "white", weight: 2 },
        parentAreaId: 100000,
        showLabel: false,//是否显示标签，默认不显示  
        labelOptions: {
          labelClassName: "labelClass",
          size: [80, 5],
          top: -40
        },
        showCity: true,//点击省份的时候是否下钻城市
        showCountry: true,//点击城市的时候是否下钻区县
        showHoverPolygon: true,
        showShadow: false,
        chinaBoundOptions: {
          show: true,
          color: 'white',
          opacity: 1,
          weight: 1,
          fillOpacity: 1
        },
        onClick: function (e) {
          _this.aimap.hideAreaBounds("100000")
          _this.regionInfo.currentCode = e.id
          _this.regionInfo.areaLevel = 'province'
          _this.regionInfo.areaName = e.name
          _this.regionInfo.provinceCode = e.id
          _this.regionInfo.provinceName = e.name
          _this.regionInfo.cityCode = ''
          _this.regionInfo.cityName = ''
          let cities = new Array() //构造渲染图层需要的省份样式数据
          _this.aimap.getAreaCentPoints(e.id, function (pros) {
            var i = 0
            pros.forEach(function (item) {
              i++
              var id = item.id
              var city = {}
              if (fillColor.length > i) {
                city = { color: "white", fillOpacity: 0.2, fillColor: fillColor[i], areaId: id, weight: 1 }
              } else {
                city = { color: "white", fillOpacity: 0.2, fillColor: fillColor[1], areaId: id, weight: 1 }
              }
              cities.push(city)
            })
          })
          var cities_options = {
            data: cities,
            hoverOptions: { color: "white", weight: 2 },
            parentAreaId: _this.regionInfo.provinceCode,
            showLabel: false,//是否显示标签，默认不显示        
            labelOptions: {
              labelClassName: "labelClass",
              size: [80, 5]
            },
            showCity: false,//点击省份的时候是否下钻城市
            showCountry: false,//点击城市的时候是否下钻区县
            showHoverPolygon: true,
            showShadow: false,
            onClick: function (e) {
              _this.regionInfo.currentCode = e.id
              _this.regionInfo.areaLevel = 'city'
              _this.regionInfo.areaName = e.name
              _this.regionInfo.cityCode = e.id
              _this.regionInfo.cityName = e.name
              _this.aimap.removeLayer(_this.provinceBoundLayer)
              if (!this.baseLayer) {
                _this.baseLayer = Ai.TileLayer("http://10.1.208.56:19081/aichinamap/rest/services/ChinaOnlineStreetPurplishBlue/MapServer")
              }
              _this.aimap.addLayer(_this.baseLayer)
              _this.aimap.setView(e.cp.reverse(), 11)
            }
          }
          //渲染钻取的省份图层
          _this.aimap.removeLayer(_this.chinaBoundLayer)
          _this.provinceBoundLayer = new Ai.BoundaryLayer(cities_options)
          _this.aimap.addLayer(_this.provinceBoundLayer)
          _this.aimap.fitBounds(_this.provinceBoundLayer.getBounds())
        }
      }
      //渲染全国图层
      this.chinaBoundLayer = new Ai.BoundaryLayer(options)
      this.aimap.addLayer(_this.chinaBoundLayer)
      this.aimap.setView([39.810693, 100.310478], 4.75)
    },
    // drillDownByArea (e) {
    //   let list = []
    //   this.aimap.getAreaCentPoints(e.areaCode, props => {
    //     props.forEach(ele => {
    //       list.push({ color: "white", fillOpacity: 0.2, fillColor: fillColor[i], areaId: ele.id, weight: 1 })
    //     })
    //   })
    //   this.aimap.hideAreaBounds(e.areaCode)
    //   let options = {
    //     data: list,
    //     parentAreaId: e.areaCode,
    //     onclick: e => this.drillDownByArea(e)
    //   }
    //   this.aimap.remove(this.boundaryLayer)
    // }
  }
}
</script>
<style lang="scss" scoped>
.map-wrap,
.map-wrap-container {
  height: 100%;
  width: 100%;
}
.map-wrap-container {
  background: rgba(8, 34, 54, 0.9);
}
.map-info,
.tool-list {
  position: absolute;
  top: 12px;
  left: 24px;
  color: white;
  z-index: 1;
}

.tool-list {
  position: absolute;
  left: unset;
  right: 24px;
}

.fe-icon {
  display: inline-block;
  background-size: cover;
}
.fe-icon-back {
  width: 32px;
  height: 32px;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zLjY4OCA4LjU2NkwwIDQuNzQzIDMuNjg4IDFsLjk2NS44NDQtMi44NTggMi44OTkgMi44NTggMi45NC0uOTY1Ljg4M3pNMTUgMTQuNjg0aC00Ljg5OHYtMS4yOGgzLjU3M3YtOC4xMkgxLjEyMnYtMS4zN0gxNXYxMC43N3ptLTkuNzk2LTEuMjYySDguNDd2MS4yNjJINS4yMDR2LTEuMjYyeiIgZmlsbD0iI0Q4RDhEOCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPjwvZz48L3N2Zz4=")
    no-repeat center;
}

.map-wrap .ant-btn {
  transition: none;
  box-shadow: inset 0 0 0 1px #3b899d;
  border: none;
  padding: 0;
  color: #ccc;
  font-size: 12px;
  background-color: transparent;
}

.ant-btn:hover {
  color: #fff;
  transition: none;
  .fe-icon-msg {
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNiAxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJhIj48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlR3JhcGhpYyIgdmFsdWVzPSIwIDAgMCAwIDEuMDAwMDAwIDAgMCAwIDAgMS4wMDAwMDAgMCAwIDAgMCAxLjAwMDAwMCAwIDAgMCAxLjAwMDAwMCAwIi8+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBmaWx0ZXI9InVybCgjYSkiPjxwYXRoIGQ9Ik0xNC44NTcgMy4xNzN2OS40MThsLTQuOTItLjAwMy0xLjkzNSAxLjg0Ny0xLjYtMS41LS4zMzctLjM0Ny00LjkyMi4wMDNWMy4xNzNNMCAydjExLjc2N2w1LjU4My4wMUw4IDE2LjExN2wyLjQxNC0yLjM0IDUuNTg2LS4wMVYySDB6Ii8+PHBhdGggZD0iTTMuNzY1IDYuNzA2aDguNDd2Ljk0MWgtOC40N3YtLjk0MXptMCAxLjg4Mmg4LjQ3di45NDFoLTguNDd2LS45NHoiLz48L2c+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPjwvZz48L3N2Zz4=")
      no-repeat center;
  }
  .fe-icon-back {
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTZ2MTZIMHoiLz48cGF0aCBkPSJNMy42ODggOC41NjZMMCA0Ljc0MyAzLjY4OCAxbC45NjUuODQ0LTIuODU4IDIuODk5IDIuODU4IDIuOTQtLjk2NS44ODN6TTE1IDE0LjY4NGgtNC44OTh2LTEuMjhoMy41NzN2LTguMTJIMS4xMjJ2LTEuMzdIMTV2MTAuNzd6bS05Ljc5Ni0xLjI2Mkg4LjQ3djEuMjYySDUuMjA0di0xLjI2MnoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48L3N2Zz4=")
      no-repeat center;
  }
  .fe-icon-tool {
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTZ2MTZIMHoiLz48cGF0aCBkPSJNMTYgMy43MThoLTMuNDI5VjFIMy40M3YyLjcxOEgwVjE1aDE2VjMuNzE3ek00LjU3MSAyLjA3OGg2Ljg1OFYzLjcxSDQuNTdWMi4wNzh6bTEwLjI4NiAxMS44NDRIMS4xNDNWOS4zNkg2LjE2djEuNTVoMy42Nzh2LTEuNTVoNS4wMTh2NC41NjN6TTcuMzA0IDkuODNWNy44MWgxLjM5MnYyLjAySDcuMzA0em03LjU1My0xLjU0OUg5Ljg0VjYuNzMySDYuMTYxdjEuNTVIMS4xNDNWNC43OTVoMTMuNzE0VjguMjh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+")
      no-repeat center;
  }
  .fe-icon-wms {
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMuNTIzIDQuODE4TDggMS41MDhsLTUuNTIzIDMuMzFMOCA4LjEyOGw1LjUyMy0zLjMxem0xLjM3IDIuNTUyTDE2IDguMTFsLTggNC43OTVMMCA4LjExbDEuMS0uNzRMOCAxMS41MTZsNi44OTMtNC4xNDZ6bTAgMy4wOTVsMS4xMDcuNzRMOCAxNmwtOC00Ljc5NSAxLjEtLjc0TDggMTQuNjFsNi44OTMtNC4xNDZ6TTAgNC43OTVMOCAwbDggNC43OTQtOCA0Ljc5NC04LTQuNzk0eiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+")
      no-repeat center;
  }
}
</style>
<style>
.count-label {
  color: white;
}
/* .aimap-interactive[stroke-width='3'] {
  display: none;
} */
</style>