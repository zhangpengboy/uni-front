/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-17 22:21:11
 * @Description : babel插件配置
 */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset']
  // 配置按需引入后，将不允许直接导入所有组件。
  // plugins: [
  //   ['import', {
  //     libraryName: 'vant',
  //     libraryDirectory: 'es',
  //     style: name => `${name}/style/less`
  //   }, 'vant']
  // ]
}
