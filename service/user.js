/*
 * @Descripttion:用户业务层
 * @Author: jsw丶郁
 * @Date: 2022-03-25 14:55:17
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 10:29:21
 */
import { request } from "../request";
/**
 * 用户登录
 * @param {String} userId 用户id
 * @param {String} userPass 用户密码
 * @returns
 */
const login = (userId, userPass) => {
  return new Promise((resovle, reject) => {
    request({
      url: "users/" + userId + ":login?userPass=" + userPass,
      isRefreshToken: false,
      type: "get",
    })
      .then((res) => {
        //用户登录成功后,将token进行缓存
        uni.setStorageSync("token", res.data);
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * 获取用户信息及功能权限
 * @returns
 */
const getCurrentUser = () => {
  return new Promise((resovle, reject) => {
    request({
      url: "users/currentUser",
      type: "get",
      isRefreshToken: false,
    })
      .then((res) => {
        uni.setStorageSync("userInfo", res.data);
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
/**
 * 刷新用户token
 * @returns
 */
const refreshToken = () => {
  return new Promise((resovle, reject) => {
    request({
      url: "users/someone:loginAgain",
      type: "get",
      isLoading: false,
      isRefreshToken: false,
    })
      .then((res) => {
        //刷新token后,将token进行缓存
        if (res.code === "200000") {
          uni.setStorageSync("token", res.data);
          resovle(res);
        } else {
          uni.setStorageSync("token", "");
          reject(res.detail);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * 获取用户的待办事项
 * @returns
 */
const getWork = () => {
  return new Promise((resovle, reject) => {
    request({
      url: "work",
      type: "get",
      isRefreshToken: false,
    })
      .then((res) => {
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default { login, getCurrentUser, refreshToken, getWork };
