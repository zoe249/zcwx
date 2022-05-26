/*
 * @Descripttion: 公用的js
 * @Author: jsw丶郁
 * @Date: 2022-03-28 11:31:20
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-07 13:57:07
 */
/**
 * 获取微信小程序用户信息
 * @returns
 */
export const getUserInfo_wx = () => {
  return new Promise((resovle, reject) => {
    uni.getUserProfile({
      provider: "weixin",
      success: function (res) {
        resovle(res);
      },
      fail: function (res) {
        uni.showToast({
          title: "获取用户信息失败",
          duration: 1500,
          mask: false,
        });
        reject(res);
      },
    });
  });
};

/**
 * 微信登录
 * @returns
 */
export const login_wx = () => {
  return new Promise((resovle, reject) => {
    uni.login({
      provider: "weixin",
      success: function (res) {
        resovle(res);
      },
      fail: function (error) {
        uni.showToast({
          title: "授权登录失败",
          duration: 1500,
          mask: false,
        });
        reject(error);
      },
    });
  });
};

export const getWxOpenId = () => {};
