/*
 * @Descripttion: 维修申请单业务api
 * @Author: jsw丶郁
 * @Date: 2022-04-11 09:35:41
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 10:07:52
 */
import { request } from "../request";

/**
 * 获取供应商用户生效/未指派单据
 * @param {Object} pageInfo 分页信息
 * @param {Object} searchInfo 查询条件
 * @returns
 */
const getApplyBills = (pageInfo, searchInfo) => {
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
        "applyBills?pageIndex=" +
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
 * 查询维修申请
 * @param {String} billNo 单号
 * @returns
 */
const getApplyByBillNO = (billNo) => {
  return new Promise((resovle, reject) => {
    request({
      url: "applyBills/" + billNo,
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
 * 判断维修申请单能不能审核
 * @param {String} billNo
 * @returns
 */
const checkApproveApply = (billNo) => {
  return new Promise((resovle, reject) => {
    request({
      url: "applyBills/" + billNo + ":checkApprove",
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
 * 审核维修申请单接口
 * @param {String} billNo
 * @param {String} operation 1-审核，2-拒绝
 * @returns
 */
const approveApply = (billNo, operation) => {
  return new Promise((resovle, reject) => {
    request({
      url: "applyBills/" + billNo + ":approve",
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
/**
 * 添加维修申请单
 * @param {Array} applyList
 * @returns
 */
const addApplyBills = (applyList) => {
  return new Promise((resovle, reject) => {
    request({
      url: "applyBills",
      type: "post",
      data: applyList,
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
 * 供应商抢单
 * @param {String} billNo
 * @param {Object} data
 * @returns
 */
const grabApplyBills = (billNo, data) => {
  return new Promise((resovle, reject) => {
    request({
      url: "applyBills/" + billNo + ":grab",
      type: "post",
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
export default {
  getApplyBills,
  getApplyByBillNO,
  checkApproveApply,
  approveApply,
  addApplyBills,
  grabApplyBills,
};
