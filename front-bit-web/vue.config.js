/*
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-22 17:13:53
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-03-25 14:06:09
 * @Description: Nothing
 */
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    // CDN引入，作为全局依赖
    externals: {
      vue: 'Vue',
    },
    name: '掘金所官网'
  }
};
