// 下钻的配配置
const drillDownConfig = {
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

// 边界颜色配置
const defaultBoundaryStyle = {
  color: "#ffffff",   // 边框颜色
  weight: 1,   // 边框宽度
  opacity: 0.4, // 边框透明度
  fillOpacity: 1,  // 填充颜色透明度
  fillColor: '#30354F99'  // 填充颜色
}

export {
  drillDownConfig,
  defaultBoundaryStyle
}