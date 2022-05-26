/*
 * @Descripttion: 封装请求
 * @Author: jsw丶郁
 * @Date: 2022-03-25 14:29:56
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 11:09:20
 */
export const defaultyBaseUrl = "http://www.yuepong.cn/test/weixiu/"; // 基础的请求信息
let header = {
  "Content-Type": "	application/json",
};
let ajaxTimes = 0; //同时调用异步请求的数量
// 封装基本的请求信息
export const request = (config) => {
  const params = config.data;
  const { baseUrl, type, url } = config;

  // 设置是否需要加载中的弹框选择，默认为需要
  const isLoading = config.isLoading === undefined ? true : config.isLoading;
  if (isLoading) {
    ajaxTimes++;
    uni.showLoading({
      title: "加载中",
      mask: true,
    });
  }

  // 设置是否需要token 默认为需要token
  const isToken = config.isToken === undefined ? true : config.isToken;
  if (isToken) {
    const token = uni.getStorageSync("token") || "";
    header.token = token;
  }
  return new Promise((resovle, reject) => {
    let closeTime = 0;
    uni.request({
      url: baseUrl ? baseUrl : defaultyBaseUrl + url,
      // 设置接口请求路径 如果存在全路径，直接使用全路径，否则进行路径拼接
      data: params,
      method: type,
      header: {
        ...header,
      },
      success: async (res) => {
        // 判断状态
        // 200 -> 成功  401 -> token过期   其他提示错误信息
        const { statusCode, data } = res;
        uni.hideLoading();
        switch (statusCode) {
          case 200:
            resovle(data);
            break;
          case 401:
            // token 过期 先删除缓存的token信息在进行跳转
            // uni.showToast({
            //   title: "登录过期,请重新登录",
            //   icon: "none",
            //   duration: 2000,
            // });
            // closeTime = 2000;
            // // 1. 清除缓存中的登录信息
            // uni.removeStorageSync("userInfo");
            // // 2. 清除缓存中的token信息
            // uni.removeStorageSync("token");
            // setTimeout(() => {
            //   uni.redirectTo({
            //     url: "../login/index",
            //   });
            // }, closeTime);
            if (isToken) {
              const result = await reastRequest(config);
              resovle(result);
            }
            break;
          case 404:
            uni.showToast({
              title: data.detail || "接口错误",
              icon: "none",
              duration: 2000,
            });
            closeTime = 2000;
            break;
          default:
            uni.showToast({
              title: data.detail || data.message,
              icon: "none",
              duration: 2000,
            });
            closeTime = 2000;
            break;
        }
      },
      fail: (error) => {
        uni.showToast({
          title: error,
          icon: "none",
          duration: 2000,
        });
        closeTime = 2000;
        reject(error);
      },
      complete: () => {
        if (isLoading) {
          ajaxTimes--;
          if (ajaxTimes === 0) {
            setTimeout(() => {
              uni.hideLoading();
            }, closeTime);
          }
        }
      },
    });
  });
};

const reastRequest = (config) => {
  return new Promise((resovle, reject) => {
    uni.request({
      url: defaultyBaseUrl + "users/someone:loginAgain",
      // 设置接口请求路径 如果存在全路径，直接使用全路径，否则进行路径拼接
      method: "get",
      header: {
        ...header,
      },
      success: async function (res) {
        //刷新token后,将token进行缓存
        if (res.data.code === "200000") {
          uni.setStorageSync("token", res.data.data);
          const result = await request(config);
          resovle(result);
        } else {
          uni.setStorageSync("token", "");
          uni.showToast({
            title: res.data.detail,
            icon: "none",
            duration: 2000,
          });
          setTimeout(() => {
            uni.reLaunch({
              url: "../login/index",
            });
          }, 2000);
        }
      },
    });
  });
};
