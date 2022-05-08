/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 16:04:29
 * @Description  : 全局挂载到Vue原型上
 */
import lodash from "lodash";
import baseUtils from "./baseUtils";
// import wxApi from './wx-api'
import apiUri from "@/api/config";
import lance from "./lance";
import md5 from "md5";

export default function (app) {
  app.config.globalProperties._ = lodash;
  app.config.globalProperties.$baseUtils = baseUtils;
  app.config.globalProperties.$lance = lance;
  app.config.globalProperties.$md5 = md5;
  app.config.globalProperties.$apiUri = apiUri;

  // 也可以使用下面这种方式挂载
  // Vue.$baseUtils = Vue.prototype.$baseUtils = baseUtils
}
