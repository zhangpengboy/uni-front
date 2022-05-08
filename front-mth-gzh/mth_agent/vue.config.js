const cdn = {
  js: [
    'https://ytb.static.lanceyi.com/static/js/vue/vue.min.js',
    'https://ytb.static.lanceyi.com/static/js/vant/vant.min.js',
    'https://ytb.static.lanceyi.com/static/js/vuex/vuex.min.js',
    'https://ytb.static.lanceyi.com/static/js/vue-router/vue-router.min.js',
    'https://ytb.static.lanceyi.com/static/js/lodash/lodash.min.js',
    'https://ytb.static.lanceyi.com/static/js/vue-baidu-map/index.min.js'
  ],
  css: [
    'https://ytb.static.lanceyi.com/static/css/app-reset.min.css',
    'https://ytb.static.lanceyi.com/static/css/vant-index.css'
  ]
}
// 开启Gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 基本路径
  outputDir: '../agent', // 输出文件目录
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production', // eslint-loader 是否在保存的时候检查
  runtimeCompiler: false,
  // webpack配置
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') { // 判断是什么环境
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
      // 生产环境注入cdn
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.externals = {
        'vue': 'Vue',
        'vant': 'vant',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'lodash': '_',
        'vue-baidu-map': 'VueBaiduMap'
      }
      // 编译时删除console.log
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // gzip配置
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css/, // 文件名匹配
          threshold: 10240, // 文件压缩阈值，对超过10k的进行压缩
          deleteOriginalAssets: false // 是否删除源文件
        })
      )
    }
  },
  // vue-loader 配置项
  // vueLoader: {},
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // less 配置CDN引入已失效,采用样式覆盖方式修改
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 可修改vant变量 https://github.com/youzan/vant/blob/dev/src/style/var.less
            'green': '#07c160', // primary
            'blue': '#1E74E4', // info
            'orange': '#eb6133', // warning
            'red': '#dc3545' // danger
          }
        }
      }
    }
  },
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require('os').cpus().length > 1,
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    port: 8888,
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true,
    proxy: {
      [process.env.VUE_APP_BASE_URL]: {

        // target: 'https://app-api.cn.utools.club', // 内网地址
        target: 'https://lz.test-api.seprain.com', // 测试地址
        // target: 'https://api.meitianhui.com', // 正式地址
        // ws: true,
        pathRewrite: { ['^' + process.env.VUE_APP_BASE_URL]: '' },
        changeOrigin: true
      }
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
