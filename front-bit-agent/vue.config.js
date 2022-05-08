/* eslint-disable prettier/prettier */
const cdn = {
  js: [
    "https://app.static.lanceyi.com/static/js/vue/vue.global.js",
    "https://app.static.lanceyi.com/static/js/vuex/vuex.global.js",
    "https://app.static.lanceyi.com/static/js/vue-router/vue-router.global.js",
    "https://app.static.lanceyi.com/static/js/vant/vant.min.js",
    "https://app.static.lanceyi.com/static/js/lodash/lodash.min.js",
  ],
  css: [
    "https://app.static.lanceyi.com/static/css/app-reset.min.css",
    "https://app.static.lanceyi.com/static/css/vant-index.css",
  ],
};
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/", // 基本路径
  outputDir: "dist", // 输出文件目录
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV !== "production", // eslint-loader 是否在保存的时候检查
  runtimeCompiler: false,
  // webpack配置
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 判断是什么环境
      // 删除预加载
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      config.optimization.splitChunks({
        chunks: "all",
      });
      // 生产环境注入cdn
      config.plugin("html").tap((args) => {
        args[0].cdn = cdn;
        return args;
      });
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.externals = {
        vue: "Vue",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        lodash: "_",
        vant: 'Vant'
      };
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
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 可修改vant变量 https://github.com/youzan/vant/blob/dev/src/style/var.less
            green: "#07c160", // primary
            blue: "#1E74E4", // info
            orange: "#F1CF86", // warning
            red: "#dc3545", // danger
            "text-color": "#333333",
            "button-border-radius": "4px",
            "button-default-color": "#999999",
            "button-default-background-color": "#EFF0F2",
            "button-default-border-color": "#EFF0F2",
            "nav-bar-icon-color": "@text-color",
            "nav-bar-title-text-color": "@text-color",
            "nav-bar-text-color": "@text-color",
            "cell-value-color": "#666666",
            "checkbox-checked-icon-color": "@blue",
            "tabs-default-color": "@blue",
            "tab-active-text-color": "@blue",
          },
        },
      },
    },
  },
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require("os").cpus().length > 1,
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    port: 8888,
    overlay: {
      warnings: false,
      errors: true,
    },
    disableHostCheck: true,
    stats: 'errors-only',
    proxy: {
      [process.env.VUE_APP_BASE_URL]: {
        // target: 'http://localhost:11000',
        // target: 'https://app-api.cn.utools.club',
        // target: 'http://myapp.cn.utools.club',
        target: "https://app.noone.ren", // 测试地址
        // ws: true,
        pathRewrite: { ["^" + process.env.VUE_APP_BASE_URL]: "" },
        changeOrigin: true,
      },
    },
  },
  transpileDependencies: ["vue-echarts", "resize-detector"],
};
