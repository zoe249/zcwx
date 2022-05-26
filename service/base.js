/*
 * @Descripttion:基础功能api层
 * @Author: jsw丶郁
 * @Date: 2022-04-12 09:35:51
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 09:29:43
 */
import { request } from "../request";
/**
 * 获取下拉框选项
 * @param {String} parentCode
 * 470表示流转状态
 * 471表示紧急程度
 * 472报修类别
 * 473代表维修授权
 * 474代表报修原因
 * 906代表生效标志
 * 478代表设备类型
 * @returns
 */
const getDicts = (parentCode) => {
  return new Promise((resovle, reject) => {
    request({
      url: "dicts/" + parentCode,
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
 * 获取设备/线材/工程信息
 * @param {*} info
 * @returns
 */
const getClass = (pageInfo, info) => {
  // 获取 pageIndex当前分页值  pageSize 分页大小 默认值是10
  const { pageIndex = 1, pageSize = 10 } = pageInfo;
  return new Promise((resovle, reject) => {
    request({
      url:
        "classes/" + info + "?pageIndex=" + pageIndex + "&pageSize=" + pageSize,
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
 * 获取关联单据的进度
 * @param {String} billCode
 * @param {String} billno
 * @returns
 */
const getFlowProgress = (billCode, billno) => {
  return new Promise((resovle, reject) => {
    request({
      url: "flowProgress" + "?billCode=" + billCode + "&billno=" + billno,
      type: "get",
    })
      .then((res) => {
        // 对结果进行处理,当前进行到第几阶段
        // 1-维修申请 2-分配任务 3-预算申请 4-维修确认
        const {
          applyStatus = null,
          dispatchStatus = nul,
          budgetStatus = nul,
          confirmStatus = nul,
        } = res;
        let flowProgresNum = 0;
        if (applyStatus !== null) {
          flowProgresNum++;
        }
        if (dispatchStatus !== null) {
          flowProgresNum++;
        }
        if (budgetStatus !== null) {
          flowProgresNum++;
        }
        if (confirmStatus !== null) {
          flowProgresNum++;
        }
        res.flowProgresNum = flowProgresNum;
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * 获取客服电话
 * @returns
 */
const getCustomTel = () => {
  return new Promise((resovle, reject) => {
    request({
      url: "/work/customTel",
      isToken: false,
      type: "get",
    })
      .then((res) => {
        uni.setStorageSync("customTel", res.data);
        resovle(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// 查询供应商  http://yapi.yuepong.cn/mock/413/vendor/{vendorid}
const getVender = (vender) =>{
	return new Promise((resolve,reject)=>{
		request({
			baseUrl:'http://yapi.yuepong.cn/mock/413/vendor/'+vender,
			type:'GET',
		})
		.then(res=>{
			resolve(res)
		})
		.catch(error=>{
			reject(error)
		})
	})
}

// 获取合同列表
const getContractList = (pageInfo,vendorid,billType) =>{
	const { pageIndex = 1, pageSize = 10 } = pageInfo;
	const isVendorid = vendorid?'&vendorid='+vendorid:'';
	const isBillType = billType?'&billtype='+billType:''
	return new Promise((resolve,reject)=>{
		request({
			baseUrl:'http://yapi.yuepong.cn/mock/413/contract?pageIndex='+pageIndex+'&pageSize='+pageSize+isVendorid+isBillType,
			url:'contract', // 测试接口
			type:'GET'
		})
		.then(res=>{
			resolve(res)
		})
		.catch(error=>{
			reject(error)
		})
	})
}

// 获取配件列表  http://yapi.yuepong.cn/mock/413/fitting
const getFittingList = (pageInfo,conId,search) => {
	console.log(conId)
	const { pageIndex = 1, pageSize = 10 } = pageInfo;
	const isConId = conId? '&conId='+conId:'';
	const isSearch = search?'&search='+search:''
	return new Promise((resolve,reject)=>{
		request({
			baseUrl:'http://yapi.yuepong.cn/mock/413/confirm/fittings?pageIndex='+pageIndex+'&pageSize='+pageSize+isConId+isSearch,
			type:'GET'
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
  getDicts,
  getClass,
  getFlowProgress,
  getCustomTel,
  getContractList,
  getFittingList,
  getVender
};
