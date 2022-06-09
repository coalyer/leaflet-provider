import Bus from '@/utils/Bus'
import store from '@/store'
// 此部分用于桥接vuex存储
export default {
  created () {
    Bus.$on('areaChange', this.areaChange)
  },
  methods: {
    /**
     * @description 区域改变监听
     * @param {object} regionInfo 区域信息
     */
    areaChange (regionInfo) {
      store.commit('Common/SET_REGION_INFO', {
        level: regionInfo.areaLevel,
        name: regionInfo.areaName,
        code: regionInfo.currentCode
      })
    }
  },
  render (h) {
    return h('span')
  },
}