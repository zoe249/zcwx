/*
 * @Descripttion: 评分业务api层
 * @Author: jsw丶郁
 * @Date: 2022-04-21 14:06:24
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-21 15:06:30
 */

import { request } from "../request";

/**
 * 获取评分设定信息
 * @returns
 */
const getScores = () => {
  return new Promise((resovle, reject) => {
    request({
      url: "scores/definition",
      isToken: false,
      type: "get",
    })
      .then((res) => {
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * 新增评分信息
 * @param {Object} params
 * @returns
 */
const addScores = (params) => {
  return new Promise((resovle, reject) => {
    request({
      url: "scores",
      type: "post",
      data: params,
    })
      .then((res) => {
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * 查询单据评分
 * @param {String} billNo
 * @returns
 */
const getScoresByBillNo = (billNo) => {
  return new Promise((resovle, reject) => {
    request({
      url: "scores/bills/" + billNo,
      type: "get",
    })
      .then((res) => {
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export default {
  getScores,
  addScores,
  getScoresByBillNo,
};
