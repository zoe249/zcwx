<!--
 * @Descripttion: 新建联系信息组件
 * @Author: jsw丶郁
 * @Date: 2022-05-06 09:25:39
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-06 10:22:31
-->
<template>
  <view class="contact-wrap">
    {{ consignee + " " + phone }}
    <image
      src="../../static/images/phone.png"
      @click="makePhone(phone)"
      v-if="phone"
    ></image>
  </view>
</template>
<script>
export default {
  props: {
    consignee: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  methods: {
    // 呼叫联系人
    makePhone(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contact-wrap {
  width: 100%;
  image {
    margin-left: 10rpx;
    width: 36rpx;
    height: 36rpx;
  }
}
</style>
