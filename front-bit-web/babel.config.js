/*
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-22 17:13:53
 * @LastEditors: Gmsoft - WeiHong Ran
 * @LastEditTime: 2021-03-25 10:32:23
 * @Description: Nothing
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@vue/babel-preset-jsx',
      {
        injectH: false,
        vModel: true,
        vOn: true
      }
    ]
  ]
};
