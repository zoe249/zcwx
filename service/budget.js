/*
 * @Descripttion: 预算申请api业务层
 * @Author: jsw丶郁
 * @Date: 2022-04-13 09:36:59
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 10:17:53
 */
import { request } from "../request";

/**
 * 获取供应商用户生效/未指派单据
 * @param {Object} pageInfo 分页信息
 * @param {Object} search 查询条件
 * @returns
 */
const getBudgetBills = (pageInfo, search) => {
  // 获取 pageIndex当前分页值  pageSize 分页大小 默认值是10
  const { pageIndex = 1, pageSize = 10 } = pageInfo;
  const { searchInfo = "", workCondition = "" } = search;
  const paramsClassName = searchInfo ? "&searchInfo=" + searchInfo : "";
  const paramsWorkCondition = workCondition
    ? "&workCondition=" + workCondition
    : "";
  return new Promise((resovle, reject) => {
    request({
      url:
        "budget?pageIndex=" +
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
 * 根据id查询预算申请单详情
 * @param {String} billno 单号
 * @returns
 */
const getBudgetByBillNO = (billno) => {
  return new Promise((resovle, reject) => {
    request({
      url: "budget/" + billno,
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
 * 确认并提交审核
 * @param {String} billno
 * @param {Object} data
 * @returns
 */
const submitAndApprove = (billno, data) => {
  return new Promise((resovle, reject) => {
    request({
      url: "budget/" + billno,
      type: "put",
      data,
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
 * 判断预算申请单能不能审核
 * @param {String} billNo
 * @returns
 */
const checkApproveBudget = (billNo) => {
  return new Promise((resovle, reject) => {
    request({
      url: "budget/" + billNo + ":checkApprove",
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
 * 审核预算申请单接口
 * @param {String} billNo
 * @param {String} operation 1-审核，2-拒绝
 * @returns
 */
const approveBudget = (billNo, operation) => {
  return new Promise((resovle, reject) => {
    request({
      url: "budget/" + billNo + ":approve",
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
  getBudgetBills,
  getBudgetByBillNO,
  submitAndApprove,
  checkApproveBudget,
  approveBudget,
};
