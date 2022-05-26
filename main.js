/*
 * @Descripttion:
 * @Author: jsw丶郁
 * @Date: 2022-03-24 15:18:56
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-05 16:53:41
 */
import App from "./App";
import service from "./service";
// #ifndef VUE3
import Vue from "vue";
import uView from "uview-ui";

// 全局挂载tabbar组件
import mineTabbar from "./components/mineTabbar/mineTabbar";
Vue.component("mine-tabbar", mineTabbar);

// 全局挂载悬浮球组件
import floatBall from "./components/floatBall/floatBall";
Vue.component("float-ball", floatBall);

Vue.use(uView);
// 如此配置即可
uni.$u.config.unit = "upx";

Vue.config.productionTip = false;
Vue.prototype.service = service;

// 定义公用的路由返回方法, 如：固定返回到某一个页面, 多个相同页面来回跳转时，返回到页面栈中,此页面第一次出现的位置
const mineRouterBack = (fullPath) => {
  const allRouter = getCurrentPages(); //获取页面栈
  const allFullPath = allRouter.length
    ? allRouter.map((item) => item.route)
    : []; //将所有已存在的路由的全路径取出,组成新数组
  const currentIndex = allFullPath.indexOf(fullPath); //获取当前需要跳转的路由的下标
  return new Promise((resovle, reject) => {
    if (currentIndex === -1) {
      reject("跳转路由未找到" + fullPath);
    } else {
      // 计算需要返回的页面数，由于得到的地址下标和页面返回的下标是相反的
      const delta = allFullPath.length - 1 - currentIndex; // 减去当前页面自己的占位
      uni.navigateBack({
        delta,
        success: (res) => {
          resovle(res);
        },
        fail: (error) => {
          reject(error);
        },
      });
    }
  });
};
Vue.prototype.routerBack = mineRouterBack;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
