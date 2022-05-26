/*
 * @Descripttion:门店api业务层
 * @Author: jsw丶郁
 * @Date: 2022-04-14 15:46:50
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-21 13:45:10
 */
import { request } from "../request";

/**
 * 获取用户对应的门店信息
 * @param {Object} pageInfo 分页信息
 * @param {String} condition 查询条件
 * @returns
 */
const getStore = (pageInfo, condition,billType) => {
  // 获取 pageIndex当前分页值  pageSize 分页大小 默认值是10
  const { pageIndex, pageSize } = pageInfo;
  const isCondition = condition ? "&condition=" + condition : "";
  const isBillType = billType ? "&billType=" + billType : "";
  return new Promise((resovle, reject) => {
    request({
      url:
        "store?pageIndex=" + pageIndex + "&pageSize=" + pageSize + isCondition + isBillType,
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
  getStore,
};
