const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host: '0.0.0.0',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'http://192.168.2.10:8888',
        // target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        ws: false,
        secure: false,
      }
    }
  }
})
