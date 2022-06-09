// 下钻的配配置
export const drillDownConfig = {
  country: {
    showCity: true, // 下钻城市
    showCountry: true, // 下钻区县
  },
  province: {
    showCity: true, // 下钻城市
    showCountry: true, // 下钻区县
  },
  city: {
    showCity: false, // 下钻城市
    showCountry: false, // 下钻区县
  }
}

export const baseLayerUrl = 'http://10.1.208.56:19081/aichinamap/rest/services/ChinaOnlineCommunity/MapServer'

export const defaultMapConfig = {
  ak: "MTY1MjkMTAwMU1UWTFNamswTURjME16TTVOaU15TmpBME5EWT0_",
  center: [39.810693, 100.310478],
  zoom: 4.75,
  minZoom: 3,
  maxZoom: 22,
  zoomSnap: 0.25
}

// 边界颜色配置
export const defaultBoundaryStyle = {
  color: "#ffffff",   // 边框颜色
  weight: 1,   // 边框宽度
  opacity: 0.4, // 边框透明度
  fillOpacity: 1,  // 填充颜色透明度
  fillColor: '#30354F99'  // 填充颜色
}