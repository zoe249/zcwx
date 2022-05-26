<!--
 * @Descripttion: 
 * @Author: jsw丶郁
 * @Date: 2022-03-24 15:18:56
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-03-28 13:42:13
-->
<template>
  <view class="content">
    <search-input @handlerImg="handlerSearch" searchType="scan"></search-input>
    <up-image></up-image>
    <mine-view>
      <view class="slide_content"></view>
    </mine-view>
  </view>
</template>

<script>
import searchInput from "../../components/searchInput/searchInput.vue";
import mineView from "../../components/mineView/mineView.vue";
import UpImage from "../../components/upImage/upImage.vue";
export default {
  components: { searchInput, UpImage, mineView },
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  methods: {
    handlerSearch(value) {
      console.log("获取查询组件的值", value);
    }, // 下拉刷新
    onPullDownRefresh() {
      console.log("refresh", this.service);
      setTimeout(function () {
        uni.stopPullDownRefresh();
      }, 1000);
    },
    // 上滑加载
    onReachBottom() {
      console.log("加载", this.service);
    },
  },
};
</script>

<style>
.content {
  width: 750rpx;
}
.slide_content {
  width: 750upx;
  height: 300upx;
  background: red;
}
</style>
