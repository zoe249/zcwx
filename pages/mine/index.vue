<!--
 * @Descripttion: 我的
 * @Author: jsw丶郁
 * @Date: 2022-03-30 10:39:56
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 09:32:50
-->
<template>
  <view class="mine-wrap">
    <!--顶部的用户信息-->
    <view class="top-user-content">
      <!--左侧头像-->
      <view class="left-image" @click="getUserProfile">
        <image :src="userImg" mode="widthFix"></image>
      </view>
      <!--右侧用户信息-->
      <view class="right-user">
        <text class="jjy-font-size-big">{{ name }}</text>
        <text>{{ account }}</text>
      </view>
    </view>
    <!--我的操作项-->
    <view class="mine-oper-wrap">
      <!--意见反馈 暂无功能-->
      <!-- <view class="opinion">
        <text>意见反馈</text>
        <u-icon name="arrow-right"></u-icon>
      </view> -->
      <!--关于我们 暂无功能-->
      <!-- <view class="abort">
        <text>关于我们</text>
        <u-icon name="arrow-right"></u-icon>
      </view> -->
      <!--当前版本-->
      <view class="version">
        <text>当前版本</text>
        <text class="right">{{ version }}</text>
      </view>
      <!--联系客服 暂无功能-->
      <view class="contact" @click="makePhone(contact)">
        <text>联系客服</text>
        <text class="right">{{ contact }}</text>
      </view>
    </view>
    <!--我的退出登录-->
    <view class="mine-logout-wrap">
      <u-button shape="circle" color="#F87070" @click="goLogout"
        >注销登录</u-button
      >
    </view>
    <mine-tabbar :tabIndex="2"></mine-tabbar>
  </view>
</template>
<script>
import { _version, _contact } from "../../static/js/index.js";
import { login_wx, getUserInfo_wx } from "../../common/index.js";
export default {
  data() {
    return {
      userImg:
        "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      name: "",
      account: "",
      hasWx: false,
    };
  },
  computed: {
    version() {
      return _version;
    },
    contact() {
      return uni.getStorageSync("customTel");
    },
  },
  onLoad: function (options) {
    // 1. 获取用户信息
    const { userid, username } = uni.getStorageSync("userInfo");
    this.account = userid || "用户";
    this.name = username || "000";
    // 2. 渲染用户头像
    const userInfo_wx = uni.getStorageSync("userInfo_wx");
    if (userInfo_wx) {
      this.hasWx = true;
      this.userImg = userInfo_wx.avatarUrl;
    }
  },
  methods: {
    getUserProfile(e) {
      const that = this;
      if (that.hasWx) {
        return;
      }
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          that.userImg = res.userInfo.avatarUrl;
          this.hasWx = true;
          uni.setStorageSync("userInfo_wx", res.userInfo);
        },
      });
    },
    // 注销登录
    async goLogout() {
      // 1. 清除缓存中的登录信息
      await uni.removeStorageSync("userInfo");
      // 2. 清除缓存中的token信息
      await uni.removeStorageSync("token");
      // 3. 清除缓存中的添加维修申请单信息
      await uni.removeStorageSync("_tempApplyList");
      // 4. 清除客服信息
      await uni.removeStorageSync("customTel");
      // 5. 跳转到登录界面 ../login/index
      uni.reLaunch({
        url: "../login/index",
      });
    },

    // 联系客服
    makePhone(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber,
        fail(error) {},
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mine-wrap {
  height: 100vh;
  background-color: #f4f4f4;
  position: relative;
}
.top-user-content {
  height: 160upx;
  background-color: $jjy-zcwx-main;
  display: flex;
  flex-direction: row;
  padding: 0 50upx;
}
.left-image {
  border-radius: 50%;
  height: 120upx;
  width: 120upx;
  border: 1px solid #ececec;
  image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.right-user {
  margin-left: 20upx;
  margin-top: 20upx;
  height: 60upx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #ffffff;
}

.mine-oper-wrap {
  margin-top: 20upx;
  background-color: #ffffff;
}
.opinion,
.abort,
.version,
.contact {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20upx;
  color: #333333;
}
.right {
  color: $jjy-zcwx-main;
}
.mine-logout-wrap {
  position: absolute;
  left: 40upx;
  right: 40upx;
  bottom: 120rpx;
}
</style>
