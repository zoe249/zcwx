/*
 * @Descripttion:文件api业务层
 * @Author: jsw丶郁
 * @Date: 2022-04-14 16:36:59
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-19 10:56:41
 */
import { defaultyBaseUrl } from "../request";

/**
 * 上传附件
 * @param {Array} file
 * @returns
 */
const upAnnexes = (tempFiles) => {
  uni.showLoading({
    title: "图片上传中",
    mask: true,
  });
  return new Promise((resovle, reject) => {
    try {
      let tasks = [];
      tempFiles.forEach((path) => {
        tasks.push(
          uni.uploadFile({
            url: defaultyBaseUrl + "/annexes", //仅为示例，非真实的接口地址
            filePath: path,
            name: "file",
          })
        );
      });
      Promise.all(tasks).then((res) => {
        uni.hideLoading();
        let statusCode = [];
        let statusIds = [];
        res.forEach((item) => {
          statusCode.push(item[1].statusCode);
          statusIds.push(JSON.parse(item[1].data).data);
        });
        const successCode = statusCode.filter((item) => item === 200);
        if (successCode.length === tempFiles.length) {
          resovle(statusIds);
        } else {
          uni.showToast({
            title: "图片上传异常,请重新上传",
            icon: "none",
          });
          reject("图片上传异常,请重新上传");
        }
      });
    } catch (err) {
      uni.hideLoading();
      uni.showToast({
        title: "图片上传异常,请重新上传",
        icon: "none",
      });
      reject("图片上传异常,请重新上传");
      throw new Error(err);
    }
  });
};

/**
 * 获取展示图
 * @param {String} id
 * @returns
 */
const downAnnexes = (ids) => {
  const imagePath = [];
  const annexesUrl = defaultyBaseUrl + "/annexes/thumbnail/";
  ids.forEach((id) => {
    imagePath.push(annexesUrl + id);
  });
  return Promise.resolve(imagePath);
};

/**
 * 获取缩略图地址
 * @param {String} ids
 * @returns
 */
const downthumbAnnexes = (ids) => {
  //拼接缩率图地址
  const imagePath = [];
  const annexesUrl = defaultyBaseUrl + "/annexes/";
  ids.forEach((id) => {
    imagePath.push(annexesUrl + id);
  });
  return Promise.resolve(imagePath);
};
export default {
  upAnnexes,
  downAnnexes,
  downthumbAnnexes,
};
