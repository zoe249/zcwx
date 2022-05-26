/*
 * @Descripttion:维保登记业务api层
 * @Author: jsw丶郁
 * @Date: 2022-04-20 16:14:12
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 10:22:25
 */
import { request } from "../request";

/**
 * 获取维保登记单分页信息
 * @param {Object} pageInfo
 * @param {Object} searchInfo 查询条件
 * @returns
 */
const getRegBills = (pageInfo, searchInfo) => {
  // 获取 pageIndex当前分页值  pageSize 分页大小 默认值是10
  const { pageIndex = 1, pageSize = 10 } = pageInfo;
  // 当前查询条件
  const { vendorId = "", workCondition = "" } = searchInfo;
  const paramsVendorId = vendorId ? "&vendorId=" + vendorId : "";
  const paramsWorkCondition = workCondition
    ? "&workCondition=" + workCondition
    : "";
  return new Promise((resovle, reject) => {
    request({
      url:
        "registers?pageIndex=" +
        pageIndex +
        "&pageSize=" +
        pageSize +
        paramsVendorId +
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
 * 通过单号查询维保登记单信息
 * @param {String} billno
 * @returns
 */
const getRegBillByBillNo = (billno) => {
  return new Promise((resovle, reject) => {
    request({
      url: "registers/" + billno,
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
 * 判断维保登记单能不能审核
 * @param {String} billNo
 * @returns
 */
const checkApproveReg = (billNo) => {
  return new Promise((resovle, reject) => {
    request({
      url: "registers/" + billNo + ":checkApprove",
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
 * 审核维保登记单接口
 * @param {String} billNo
 * @param {String} operation 1-审核，2-拒绝
 * @returns
 */
const approveReg = (billNo, operation) => {
  return new Promise((resovle, reject) => {
    request({
      url: "registers/" + billNo + ":approve",
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

// 修改维保登记 http://yapi.yuepong.cn/mock/413/registers/{billNo}
const registersReg = (registerDs,billno) =>{
	return new Promise((resolve,reject)=>{
		request({
			baseUrl:'http://yapi.yuepong.cn/mock/413/registers/'+billno,
			type:'PUT',
			data:{
				registerDs
			}
		})
		.then(res=>{
			resolve(res)
		})
		.catch(error=>{
			reject(error)
		})
	})
}

// 新增维保登记 http://yapi.yuepong.cn/mock/413/registers
const addRegistersReg = (data)=>{
	return new Promise((resolve,reject)=>{
		request({
			baseUrl:'http://yapi.yuepong.cn/mock/413/registers',
			type:'POST',
			data
		})
		.then(res=>{
			resolve(res)
		})
		.catch(error=>{
			reject(error)
		})
	})
}

export default {
  getRegBills,
  getRegBillByBillNo,
  checkApproveReg,
  approveReg,
  registersReg,
  addRegistersReg
};
