<!--
 * @Descripttion: 上传图片的组件
 * @Author: jsw丶郁
 * @Date: 2022-03-25 11:05:07
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-19 16:18:40
-->

<template>
  <view class="up-image-wrap">
    <text>照片不能超过{{ maxImageNum }}张:</text>
    <view class="image_wrap">
      <!--需要上传的图片内容框-->
      <view
        class="image_content"
        v-for="(item, index) in imageArr"
        :key="index"
      >
        <image :src="item" @click="previewUpImg(index)"></image>
        <view class="del" @click="deleteUpImg(index)">
          <image src="../../static/images/del-small.png"></image
        ></view>
      </view>
      <!--上传的按钮显示-->
      <view class="up-btn-view">
        <view
          class="up_btn"
          v-if="imageArr.length < maxImageNum"
          @click="chooseImage"
        >
          <image src="../../static/images/add.png"></image> </view
      ></view>
    </view>
  </view>
</template>
<script>
export default {
  name: "upImage",
  data() {
    return {
      imageArr: [], // 图片数组信息
    };
  },
  props: {
    maxImageNum: {
      //最大可支持的图片数量
      type: Number,
      default: 5,
    },
  },
  methods: {
    /**
     * 上传选择图片
     */
    chooseImage() {
      const that = this;
      const chooseNum = that.maxImageNum - that.imageArr.length;
      uni.chooseImage({
        count: chooseNum, //默认9
        success: function (res) {
          that.imageArr = [...that.imageArr, ...res.tempFilePaths];
          that.comperssImgs(that.imageArr).then((res) => {
            that.$emit("getUpImage", res);
          });
        },
      });
    },
    /**
     * 预览图片
     */
    previewUpImg(index) {
      uni.previewImage({
        urls: this.imageArr,
        current: index,
      });
    },
    /**
     * 删除图片
     */
    deleteUpImg(index) {
      this.imageArr.splice(index, 1);
      this.comperssImgs(this.imageArr).then((res) => {
        this.$emit("getUpImage", res);
      });
    },
    comperssImgs(images) {
      let comperssImgs = [];
      return new Promise((resovle, reject) => {
        images.forEach((item) => {
          comperssImgs.push(
            uni.compressImage({
              src: item,
              quality: 80,
            })
          );
        });
        Promise.all(comperssImgs)
          .then((res) => {
            const status = [];
            const tempImgs = [];
            res.forEach((item) => {
              status.push(item[1].errMsg);
              tempImgs.push(item[1].tempFilePath);
            });
            if (status.every((item) => item === "compressImage:ok")) {
              resovle(tempImgs);
            } else {
              uni.showToast({
                title: "图片压缩失败",
              });
              reject("图片压缩失败");
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.up-image-wrap {
  display: flex;
  flex-direction: column;
}
.image_wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15upx;
}
.image_wrap .image_content {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 120upx;
  height: 100upx;
  margin-right: 20upx;
}
.image_content > image {
  margin-bottom: 20upx;
  width: 120upx;
  height: 100upx;
  border: 2upx solid #ccc;
  border-radius: 10upx;
}
.image_content .del {
  position: absolute;
  width: 30upx;
  height: 30upx;
  top: -15upx;
  right: -10upx;
  image {
    width: 100%;
    height: 100%;
  }
}
.up-btn-view {
  height: 100upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 15upx;
  .up_btn {
    width: 70upx;
    height: 70upx;
    padding-left: 10upx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
