##### 基础使用
通过provide/inject来使用
AIMapProvider 对外暴露自生所有属性和方法
需要使用地图属性和方法的组件自行inject

```Js
export default {
  inject: ['AiMapProvider'],
  methods: {
    handleSetRegionColor() {
      this.AiMapProvider.setRegionColor('100000', 'country', [
        { id: '630000', fillColor: 'red'}
      ])
    }
  }
}
```
**setRegionColor**
| 参数| 类型| 作用 | 默认值 | 示例 |
|--|--|--|--|--|
| areaConfig | Object | 渲染区域配置 | { } | |

**areaConfig**
| 参数| 类型| 作用 | 默认值 | 示例 |
|--|--|--|--|--|
|code | String\|Number | 区划code | 地图当前区划code |  |
|level | String| 区划级别 | 地图当前区划级别 | |
|defaultColor | String| 默认填充颜色 | |
|data |Array | 子级区划的的配置 | |

**data item**
| 参数| 类型| 作用 | 默认值 | 示例 |
|--|--|--|--|--|
| id | String\|Number | 区划code | 必须 |  |
| fillColor | String| 区划级别 | 填充颜色 | |
| fillOpacity | String|填充透明度 |1 | |
| color |String | 边框颜色 |white | |
| opacity |String | 边框透明度 |0.4 | |
| weight | Number | 边框宽度 | 1 | |

##### 图层部分

通过provide/inject来使用
AIMapProvider 对外暴露自生所有属性和方法
需要使用地图属性和方法的组件自行inject

```Js
export default {
  inject: ['AiMapProvider'],
  methods: {
    handleLoadLayers () {
      const list = [
          {
              name: 'ah:geo_county',
              url: 'http://192.168.74.210:5071/gisserver/ah/wms',
              clickCallback: this.clickEvent
          },
      ]
      this.AiMapProvider.aimap.setView([32.018,117.262], 7)
      this.AiMapProvider.loadWmsLayers(list)
    },
    clickEvent (data, evt, feaType) {
      console.log(data)
      console.log(evt)
      console.log(feaType)
    }
  }
}
```

**loadWmsLayers**

| 参数| 类型| 作用 | 默认值 | 示例 |
|--|--|--|--|--|
| layers | Array | 要加载的图层，如已在地图，则不会加载 | [] |  |


**layer**
| 参数| 类型| 作用 | 默认值 | 示例 |
|--|--|--|--|--|
| name| String | 图层名称 | 必需 | |
| url | String | 图层服务路径 | 必需| |
| clickCallback| Function | 点击事件回调| 无 | |
| cql | String | 图层元素过滤 | 无 | |



