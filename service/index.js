/*
 * @Descripttion:
 * @Author: jsw丶郁
 * @Date: 2022-03-25 14:53:49
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-03-25 14:54:59
 */
var module = require.context(".", true, /\.js/);
var routerOb = {};
module.keys().forEach((key) => {
  if (key.indexOf("index") == -1) {
    var _keyarr = key.split("./");
    var _namearr = _keyarr[1].split(".js");

    // 默认接口地址前加上文件名前缀
    const apiObj = module(key).default;
    routerOb[_namearr[0]] = apiObj;
  }
});
export default routerOb;
