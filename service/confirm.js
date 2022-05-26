/*
 * @Descripttion:维修确认业务api层
 * @Author: jsw丶郁
 * @Date: 2022-04-20 13:42:08
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 10:19:44
 */
import { request } from "../request";

/**
 * 获取维修确认单分页信息
 * @param {Object} pageInfo
 * @param {Object} searchInfo 查询条件
 * @returns
 */
const getConfirmBills = (pageInfo, searchInfo) => {
  // 获取 pageIndex当前分页值  pageSize 分页大小 默认值是10
  const { pageIndex = 1, pageSize = 10 } = pageInfo;
  // 当前查询条件
  const { className = "", workCondition = "" } = searchInfo;
  const paramsClassName = className ? "&className=" + className : "";
  const paramsWorkCondition = workCondition
    ? "&workCondition=" + workCondition
    : "";
  return new Promise((resovle, reject) => {
    request({
      url:
        "confirm?pageIndex=" +
        pageIndex +
        "&pageSize=" +
        pageSize +
        paramsClassName +
        paramsWorkCondition,
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
 * 通过单号查询维修确认单信息
 * @param {String} billno
 * @returns
 */
const getConfirmBillByBillNo = (billno) => {
  return new Promise((resovle, reject) => {
    request({
      url: "confirm/" + billno,
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
 * 判断维修确认单能不能审核
 * @param {String} billNo
 * @returns
 */
const checkApproveConfirm = (billNo) => {
  return new Promise((resovle, reject) => {
    request({
      url: "confirm/" + billNo + ":checkApprove",
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
 * 审核维修确认单接口
 * @param {String} billNo
 * @param {String} operation 1-审核，2-拒绝
 * @returns
 */
const approveConfirm = (billNo, operation) => {
  return new Promise((resovle, reject) => {
    request({
      url: "confirm/" + billNo + ":approve",
      type: "put",
      data: { operation },
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
  getConfirmBills,
  getConfirmBillByBillNo,
  checkApproveConfirm,
  approveConfirm,
};
