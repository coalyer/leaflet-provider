<template>
  <div class="tool-wrapper-light">
    <section ref="radMenu" v-show="showRadMenu" class="fe-gis-popup">
      <div class="radmenu fe-flex-center">
        <div class="circle-inner fe-flex-center" :class="{'rad4':radMenuList.length===4}">
          <i></i>
          <ul ref="radDom" @click="handleRadItemClick">
            <li
              v-for="item in radMenuList"
              :key="item"
              class="fe-flex-center"
              :class="{'active':curRadItem===item}"
            >{{item}}</li>
          </ul>
        </div>
      </div>
    </section>
    <!-- tool层 最后一层地市的时候展示 -->
    <div
      class="fe-gis__top-right fe-flex-start b-gis-tool"
      :class="{ 'dynamic-top': foldType }"
      style="z-index: 3000"
    >
      <!-- 地市 图层选择 -->
      <a-popover placement="bottomRight" overlayClassName="fe-popper" trigger="click">
        <template #content>
          <div class="fe-flex-column">
            <div class="fe-tablist fe-flex">
              <div
                class="fe-tab-item cursor-pointer"
                :class="{ active: wmsTabActive === 'common' }"
                @click="wmsTabActive = 'common'"
              >公共图层</div>
              <div
                class="fe-tab-item cursor-pointer"
                :class="{ active: wmsTabActive === 'customed' }"
                @click="wmsTabActive = 'customed'"
              >专题图层</div>
            </div>
            <div
              v-if="wmsTabActive === 'common'"
              style="margin-bottom: -8px"
              class="fe-px-lg fe-py-md layer-category"
            >
              <div class="title">基础资源数据图层</div>
              <a-checkbox-group v-model="baseResourceList">
                <a-checkbox
                  :value="item.value"
                  v-for="(item, index) in commonOptions.slice(0, 5)"
                  :key="index"
                >{{ item.label }}</a-checkbox>
              </a-checkbox-group>

              <div class="title">专题业务图层</div>
              <a-checkbox-group v-model="specialBusList" @change="specialBusChange">
                <a-checkbox
                  :value="item.value"
                  v-for="(item, index) in commonOptions.slice(5, 9)"
                  :key="index"
                >
                  {{ item.label }}
                  <a-radio-group
                    v-if="item.value === 'grid4G'"
                    v-model="grid4G"
                    :options="item.children"
                    :disabled="grid4GDisabled"
                  />
                  <a-radio-group
                    v-if="item.value === 'grid5G'"
                    v-model="grid5G"
                    :options="item.children"
                    :disabled="grid5GDisabled"
                  />
                </a-checkbox>
              </a-checkbox-group>

              <div class="title">网络规划图层</div>
              <a-checkbox-group v-model="networkPlanList">
                <a-checkbox
                  :value="item.value"
                  v-for="(item, index) in commonOptions.slice(9, 11)"
                  :key="index"
                >{{ item.label }}</a-checkbox>
              </a-checkbox-group>
            </div>
            <div
              v-if="wmsTabActive === 'customed'"
              style="margin-bottom: -8px"
              class="fe-px-lg fe-py-md"
            >
              <a-radio-group v-model="checkedCustimedGrids" v-if="bizComponent == 'ResideThan5G'">
                <a-radio
                  v-for="grid in customedOptions"
                  :key="grid.value"
                  :value="grid.value"
                  class="radio-label-in-parent"
                >
                  {{ grid.label }}
                  <a-checkbox-group v-model="checkedCustomedList" style="margin-left: 20px;">
                    <a-checkbox
                      v-for="csite in grid.children"
                      :key="csite.value"
                      :value="csite.value"
                    >{{ csite.label }}</a-checkbox>
                  </a-checkbox-group>
                </a-radio>
              </a-radio-group>
              <!--规划前  -->
              <template v-if="customedGridOriginal && customedGridOriginal.length">
                <div class="fe-line"></div>
                <p class="fe-tool-title">规划前</p>
                <a-radio-group v-model="checkedCustimedGrids">
                  <a-radio
                    v-for="grid in customedGridOriginal"
                    :key="grid.value"
                    :value="grid.value"
                    :style="radioStyle"
                  >{{ grid.label }}</a-radio>
                </a-radio-group>
              </template>
              <!--规划后  -->
              <template v-if="checkedCustimedGrids && checkedCustimedGrids.length">
                <div class="fe-line"></div>
                <p class="fe-tool-title">规划后</p>
                <a-radio-group v-model="checkedCustimedGrids">
                  <a-radio
                    v-for="grid in customedGridFinal"
                    :key="grid.value"
                    :value="grid.value"
                    :style="radioStyle"
                  >{{ grid.label }}</a-radio>
                </a-radio-group>
              </template>
            </div>
          </div>
        </template>
        <a-button class="fe-flex-center fe-box fe-mr-sm">
          <i style="margin-left: -6px" class="fe-icon fe-icon-wms"></i>
          <span>图层选择</span>
        </a-button>
      </a-popover>
      <!-- 工具箱 -->
      <a-popover placement="bottomLeft" overlayClassName="fe-popper">
        <template #content>
          <div class="fe-p-md">
            <ol style="margin-bottom: -12px">
              <li
                v-for="tool in toolList"
                :key="tool.v"
                class="fe-align-center fe-mb-md cursor-pointer"
              >
                <div @click="handleToolClick(tool)">
                  <a-icon
                    v-if="tool.l === '清除'"
                    type="delete"
                    style="font-size:16px;margin-right:4px;"
                  ></a-icon>
                  <i v-else :class="`fe-icon fe-icon-${tool.v}`"></i>
                  <span>{{ tool.l }}</span>
                </div>
              </li>
            </ol>
          </div>
        </template>
        <a-button class="fe-flex-center fe-box fe-mr-sm">
          <i style="margin-left: -6px" class="fe-icon fe-icon-tool"></i>
          <span>工具箱</span>
        </a-button>
      </a-popover>
      <!--20220518作废： 未知作用按钮 -->
      <!-- <a-button
        v-if="regionInfo.level === 'city'"
        style="padding: 0"
        class="gis-btn--layers fe-flex-center fe-box fe-mr-sm fe-bd cursor-pointer"
      >
        <i class="fe-icon fe-icon-msg"></i>
      </a-button>-->
      <!-- 返回按钮 -->
      <a-button
        style="padding: 0"
        class="gis-btn--layers fe-flex-center fe-box fe-bd cursor-pointer"
        @click="handlePageReset"
      >
        <i class="fe-icon fe-icon-back"></i>
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex"
import { LAYERS_BY_SCENE } from "./Layer"
export default {
  name: "MapTool",
  data () {
    return {
      toolList: [
        { l: "测距", v: "line", evt: "handleGisMeasureDistance" },
        { l: "屏幕切换", v: "block" },
        { l: "框选方式", v: "select", evt: "handleGisDrawPolygon" },
        { l: "清除", v: "delete", evt: "handleRemoveDraw" }
      ],
      wmsTabActive: "customed", // 图层选择tab页
      baseResourceList: ['dim_cell_config_unicom'], // 基础资源图层多选
      specialBusList: [], // 专题业务图层多选
      networkPlanList: [], // 网络规划图层多选
      grid4G: '', // 专题业务图层-4g栅格-单选框
      grid5G: '', // 专题业务图层-5g栅格-单选框
      grid4GDisabled: false, // 4g栅格是否禁用
      grid5GDisabled: false, // 5g栅格是否禁用
      commonOptions: [],
      checkedCustomedList: [], // 市级别被选中的多选站址指标
      customedOptions: [],
      checkedCustimedGrids: "", // 市级别被选中的单选栅格指标
      radioStyle: {
        display: "block",
        height: "24px",
        lineHeight: "24px",
        color: "#fff",
        fontSize: "12px",
      },
      activeTool: '',// 判断当前地图是否有做绘制操作
      editableLayers: null, // 多边形框选编辑图层
      drawControl: null, // 多边形框选控制器层
      showRadMenu: false,
      radMenuList: ['邻区', '覆盖', '栅格', '工单', '性能', '工参'],
      curRadItem: '',
    }
  },
  inject: ['AiMapProvider'],
  computed: {
    ...mapState("Common", ["regionInfo", "bizComponent"]),
    ...mapGetters(["foldType", "categoryName"]),
    customedGridOriginal () {
      // 规划qian定制栅格选项
      return this.customedOptions.filter((item) => item.grid_type === "original")
    },
    customedGridFinal () {
      // 规划hou定制栅格选项
      return this.customedOptions.filter((item) => item.grid_type === "final")
    },
  },
  mounted () {
    this.SET_FOLD_TYPE(true)
    this.initLayerList()
  },
  methods: {
    ...mapMutations("Common", ["SET_REGION_INFO", "SET_FOLD_TYPE"]),
    ...mapMutations("Gis", ["SET_CHECKED_CELL", "SET_CHECKED_AREA", "SET_CHECKED_SITE", "SET_DRAWED_AREA"]),
    specialBusChange (val) {
      if (val.indexOf('grid4G') != -1) {
        this.grid4G = 'RSRP'
        this.grid4GDisabled = false
      } else {
        this.grid4G = ''
        this.grid4GDisabled = true
      }
      if (val.indexOf('grid5G') != -1) {
        this.grid5G = 'RSRP'
        this.grid5GDisabled = false
      } else {
        this.grid5G = ''
        this.grid5GDisabled = true
      }
    },
    handleRadItemClick (e) {
      if (e.target.localName === 'li') { //过滤点击中间的图标
        // 事件委托
        this.curRadItem = e.target.innerText
        this.showBaseInfo = true
      }
    },
    // 初始化图层管理
    initLayerList () {
      let allLayers = LAYERS_BY_SCENE[this.bizComponent]
      if (!allLayers) allLayers = { commonLayers: [], customedLayers: [] } // 当场景不在字典表中，则给空
      this.checkedCommonList = allLayers["commonLayers"]
        .filter((i) => i.checked)
        .map((i) => i.value)
      this.commonOptions = allLayers["commonLayers"]
      this.checkedCustomedList = allLayers["customedLayers"]
        .filter((i) => i.checked)
        .map((i) => i.value)
      this.customedOptions = allLayers["customedLayers"]
      let layers = [
        ...allLayers["commonLayers"].filter((i) => i.checked),
        ...allLayers["customedLayers"].filter((i) => i.checked),
      ]
      // this.initWmsLayers(layers)
    },
    // 返回
    handlePageReset () {
      this.AiMapProvider.drillDownReserve()
    },
    // 工具箱点击
    handleToolClick (item) {
      if (item.l === '清除') {
        this.activeTool = ''
        // this.handleRemoveDraw()
      } else if (this.activeTool) {
        this.$message.warning('请先结束当前操作(点击清除按钮)')
      } else {
        this.activeTool = item.l
        this[item.evt]()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.layer-category {
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #5bacbb;
    margin-bottom: 10px;
  }
}
.tool-wrapper-light {
  width: fit-content;
  height: fit-content;
  .ant-btn {
    transition: none;
    box-shadow: inset 0 0 0 1px #3b899d;
    border: none;
    // color: #ccc;
    font-size: 12px;
    // background-color: transparent;
  }
  .b-gis-tool {
    margin-top: 150px; // * 卡片的初始展开高度 + 间隔12px
    &.dynamic-top {
      margin-top: 72px;
    }
  }
}
.gis-btn--layers {
  color: #ebebeb;
}
.fe-icon {
  display: inline-block;
  background-size: cover;
}
.fe-icon-msg {
  width: 32px;
  height: 32px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNiAxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJhIj48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlR3JhcGhpYyIgdmFsdWVzPSIwIDAgMCAwIDAuODQ3MDAwIDAgMCAwIDAgMC44NDcwMDAgMCAwIDAgMCAwLjg0NzAwMCAwIDAgMCAxLjAwMDAwMCAwIi8+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBmaWx0ZXI9InVybCgjYSkiPjxwYXRoIGQ9Ik0xNC44NTcgMy4xNzN2OS40MThsLTQuOTItLjAwMy0xLjkzNSAxLjg0Ny0xLjYtMS41LS4zMzctLjM0Ny00LjkyMi4wMDNWMy4xNzNNMCAydjExLjc2N2w1LjU4My4wMUw4IDE2LjExN2wyLjQxNC0yLjM0IDUuNTg2LS4wMVYySDB6Ii8+PHBhdGggZD0iTTMuNzY1IDYuNzA2aDguNDd2Ljk0MWgtOC40N3YtLjk0MXptMCAxLjg4Mmg4LjQ3di45NDFoLTguNDd2LS45NHoiLz48L2c+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPjwvZz48L3N2Zz4=')
    no-repeat center;
}
.fe-icon-back {
  width: 32px;
  height: 32px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zLjY4OCA4LjU2NkwwIDQuNzQzIDMuNjg4IDFsLjk2NS44NDQtMi44NTggMi44OTkgMi44NTggMi45NC0uOTY1Ljg4M3pNMTUgMTQuNjg0aC00Ljg5OHYtMS4yOGgzLjU3M3YtOC4xMkgxLjEyMnYtMS4zN0gxNXYxMC43N3ptLTkuNzk2LTEuMjYySDguNDd2MS4yNjJINS4yMDR2LTEuMjYyeiIgZmlsbD0iI0Q4RDhEOCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPjwvZz48L3N2Zz4=')
    no-repeat center;
}
.fe-icon-tool {
  width: 32px;
  height: 32px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xNiAzLjcxOGgtMy40MjlWMUgzLjQzdjIuNzE4SDBWMTVoMTZWMy43MTd6TTQuNTcxIDIuMDc4aDYuODU4VjMuNzFINC41N1YyLjA3OHptMTAuMjg2IDExLjg0NEgxLjE0M1Y5LjM2SDYuMTZ2MS41NWgzLjY3OHYtMS41NWg1LjAxOHY0LjU2M3pNNy4zMDQgOS44M1Y3LjgxaDEuMzkydjIuMDJINy4zMDR6bTcuNTUzLTEuNTQ5SDkuODRWNi43MzJINi4xNjF2MS41NUgxLjE0M1Y0Ljc5NWgxMy43MTRWOC4yOHoiIGZpbGw9IiNEOEQ4RDgiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik0wIDBoMTZ2MTZIMHoiLz48L2c+PC9zdmc+')
    no-repeat center;
}
.fe-icon-wms {
  width: 32px;
  height: 32px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMuNTIzIDQuODE4TDggMS41MDhsLTUuNTIzIDMuMzFMOCA4LjEyOGw1LjUyMy0zLjMxem0xLjM3IDIuNTUyTDE2IDguMTFsLTggNC43OTVMMCA4LjExbDEuMS0uNzRMOCAxMS41MTZsNi44OTMtNC4xNDZ6bTAgMy4wOTVsMS4xMDcuNzRMOCAxNmwtOC00Ljc5NSAxLjEtLjc0TDggMTQuNjFsNi44OTMtNC4xNDZ6TTAgNC43OTVMOCAwbDggNC43OTQtOCA0Ljc5NC04LTQuNzk0eiIgZmlsbD0iI0Q4RDhEOCIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+')
    no-repeat center;
}
.ant-btn:hover {
  color: #169bfa;
  transition: none;
  // .fe-icon-msg {
  //   background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNiAxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJhIj48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlR3JhcGhpYyIgdmFsdWVzPSIwIDAgMCAwIDEuMDAwMDAwIDAgMCAwIDAgMS4wMDAwMDAgMCAwIDAgMCAxLjAwMDAwMCAwIDAgMCAxLjAwMDAwMCAwIi8+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBmaWx0ZXI9InVybCgjYSkiPjxwYXRoIGQ9Ik0xNC44NTcgMy4xNzN2OS40MThsLTQuOTItLjAwMy0xLjkzNSAxLjg0Ny0xLjYtMS41LS4zMzctLjM0Ny00LjkyMi4wMDNWMy4xNzNNMCAydjExLjc2N2w1LjU4My4wMUw4IDE2LjExN2wyLjQxNC0yLjM0IDUuNTg2LS4wMVYySDB6Ii8+PHBhdGggZD0iTTMuNzY1IDYuNzA2aDguNDd2Ljk0MWgtOC40N3YtLjk0MXptMCAxLjg4Mmg4LjQ3di45NDFoLTguNDd2LS45NHoiLz48L2c+PHBhdGggZD0iTTAgMGgxNnYxNkgweiIvPjwvZz48L3N2Zz4=')
  //     no-repeat center;
  // }
  // .fe-icon-back {
  //   background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTZ2MTZIMHoiLz48cGF0aCBkPSJNMy42ODggOC41NjZMMCA0Ljc0MyAzLjY4OCAxbC45NjUuODQ0LTIuODU4IDIuODk5IDIuODU4IDIuOTQtLjk2NS44ODN6TTE1IDE0LjY4NGgtNC44OTh2LTEuMjhoMy41NzN2LTguMTJIMS4xMjJ2LTEuMzdIMTV2MTAuNzd6bS05Ljc5Ni0xLjI2Mkg4LjQ3djEuMjYySDUuMjA0di0xLjI2MnoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48L3N2Zz4=')
  //     no-repeat center;
  // }
  // .fe-icon-tool {
  //   background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTZ2MTZIMHoiLz48cGF0aCBkPSJNMTYgMy43MThoLTMuNDI5VjFIMy40M3YyLjcxOEgwVjE1aDE2VjMuNzE3ek00LjU3MSAyLjA3OGg2Ljg1OFYzLjcxSDQuNTdWMi4wNzh6bTEwLjI4NiAxMS44NDRIMS4xNDNWOS4zNkg2LjE2djEuNTVoMy42Nzh2LTEuNTVoNS4wMTh2NC41NjN6TTcuMzA0IDkuODNWNy44MWgxLjM5MnYyLjAySDcuMzA0em03LjU1My0xLjU0OUg5Ljg0VjYuNzMySDYuMTYxdjEuNTVIMS4xNDNWNC43OTVoMTMuNzE0VjguMjh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+')
  //     no-repeat center;
  // }
  // .fe-icon-wms {
  //   background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTMuNTIzIDQuODE4TDggMS41MDhsLTUuNTIzIDMuMzFMOCA4LjEyOGw1LjUyMy0zLjMxem0xLjM3IDIuNTUyTDE2IDguMTFsLTggNC43OTVMMCA4LjExbDEuMS0uNzRMOCAxMS41MTZsNi44OTMtNC4xNDZ6bTAgMy4wOTVsMS4xMDcuNzRMOCAxNmwtOC00Ljc5NSAxLjEtLjc0TDggMTQuNjFsNi44OTMtNC4xNDZ6TTAgNC43OTVMOCAwbDggNC43OTQtOCA0Ljc5NC04LTQuNzk0eiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+')
  //     no-repeat center;
  // }
}
::v-deep .leaflet-popup-content-wrapper {
  box-shadow: none !important;
  background: none;
}
::v-deep .leaflet-popup-tip {
  display: none;
}
.radio-label-in-parent.ant-radio-wrapper {
  display: block;
}

.radmenu {
  width: 150px;
  height: 150px;
  // box-shadow: 0 0 6px 0 rgba(123, 147, 167, 0.8);
  border-radius: 50%;
  // background: rgba(255, 255, 255, 0.7);
  .circle-inner {
    position: relative;
    z-index: 2;
    width: 150px;
    height: 150px;
    background: rgba(223, 235, 244, 0.3);
    border-radius: 50%;
    border: 1px solid#169bfa;
    i {
      position: relative;
      width: 42px;
      height: 42px;
      background: url('~@/assets/images/site.svg') no-repeat center;
      background-size: cover;
    }
    ul {
      position: absolute;
      z-index: 1;
      width: 40px;
      height: 40px;
      margin: auto;
      border-radius: 50%;
      transform: scale(0.6);
      li {
        position: absolute;
        width: 40px;
        height: 40px;
        line-height: 1;
        background: #fff;
        text-align: center;
        border-radius: 20px;
        padding: 5px;
        transition: transform 0.5s;
        transform: translate3d(0, 0, 0);
        border: 1.5px solid #169bfa;
        cursor: pointer;
        &:hover,
        &.active {
          color: #fff;
          background: #169bfa;
        }
      }
      &.animation {
        z-index: 10;
        transform: scale(1);
        li:first-child {
          transform: translateY(-72px);
        }
        li:nth-child(2) {
          transform: translateX(62px) translateY(-40px);
        }
        li:nth-child(3) {
          transform: translateX(62px) translateY(40px);
        }
        li:nth-child(4) {
          transform: translateY(72px);
        }
        li:nth-child(5) {
          transform: translateX(-62px) translateY(-40px);
        }
        li:last-child {
          transform: translateX(-62px) translateY(40px);
        }
      }
    }
  }
}
.radmenu .circle-inner.rad4 {
  ul.animation {
    z-index: 10;
    transform: scale(1);
    li:first-child {
      transform: translateY(-72px);
    }
    li:nth-child(2) {
      transform: translateX(72px) translateX(72px);
    }
    li:nth-child(3) {
      transform: translateY(72px);
    }
    li:last-child {
      transform: translateX(-72px);
    }
  }
}
</style>
