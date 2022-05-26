<!--
 * @Descripttion: 授权
 * @Author: jsw丶郁
 * @Date: 2022-03-30 10:44:19
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-07 13:04:04
-->
<template>
  <view class="auth-wrap">
    <!-- 显示的标题-->
    <mine-title></mine-title>
    <!-- 授权的按钮 -->
    <view class="auth-btn-group">
      <!-- 暂无此功能-->
      <!-- <view class="auth-btn">
        <u-button
          shape="circle"
          color="#66C5D7"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
          >微信授权登录 / 绑定</u-button
        >
      </view> -->
      <view class="login-btn">
        <u-button shape="circle" color="#70A4F8" @click="goLogin"
          >账号密码登录</u-button
        ></view
      >
    </view>
  </view>
</template>

<script>
import mineTitle from "../../components/mineTitle/mineTitle.vue";
export default {
  data() {
    return {};
  },
  components: { mineTitle },
  watch: {},
  methods: {
    /**
     * 获取用户手机号
     */
    getPhoneNumber(e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        console.log("用户点击了接受");
        //e.detail这里会有三个属性
        //encryptedData
        //errMsg
        //iv
      } else {
        console.log("用户点击了拒绝");
      }
    },
    /**
     * 跳转到登录界面
     */
    goLogin() {
      uni.navigateTo({
        url: "../login/index",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.auth-wrap {
  padding: 100upx 100upx;
}
.auth-btn-group {
  margin-top: 100upx;
}
.login-btn {
  margin-top: 50upx;
}
</style>
