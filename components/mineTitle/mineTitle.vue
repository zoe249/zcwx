<!--
 * @Descripttion: 标题栏组件
 * @Author: jsw丶郁
 * @Date: 2022-03-30 13:46:19
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-11 11:26:12
-->
<template>
  <view class="title_wrap">
    <text class="title_content">
      {{ title }}
    </text>
    <view class="title_border"></view>
  </view>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "维修管理平台",
    },
  },
};
</script>

<style lang="scss" scoped>
.title_wrap {
  width: 100%;
  height: 100upx;
  display: flex;
  flex-direction: column;
}
.title_content {
  height: 90upx;
  line-height: 90upx;
  font-size: 60upx;
  font-weight: 600;
}
.title_border {
  height: 12upx;
  width: 180upx;
  background-color: $jjy-zcwx-main;
  border-radius: 15upx;
}
</style>
