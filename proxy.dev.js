module.exports = {
  '/gisapi/': {
    // ? 受aimap限制,此alias名称只能使用gisapi
    target: 'http://192.168.74.189:9999/gisapi/',
    changeOrigin: true,
    pathRewrite: {
      '^/gisapi/': '',
    },
  },
  '/api_aimap_wms/': {
    target: 'http://10.1.249.43:5080/aimap-server/service/gisWorkSpace/wms',
    changeOrigin: '',
    pathRewrite: {
      '^/api_aimap_wms/': '',
    }
  }
}
