<!--
 * @Descripttion: 登录
 * @Author: jsw丶郁
 * @Date: 2022-03-30 10:41:33
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-11 13:57:43
-->
<template>
  <view class="auth-wrap">
    <!-- 显示的标题-->
    <mine-title></mine-title>
    <!-- 授权的按钮 -->
    <view class="login-form-user">
      <u-input
        placeholder="请输入账号"
        v-model="account"
        prefixIcon="account"
        prefixIconStyle="font-size: 22px;color: #909399"
        shape="circle"
        type="number"
      >
        <view
          slot="suffix"
          class="ipnut-icon-view"
          @click="
            account = '';
            password = '';
          "
        >
          <u-icon
            name="close-circle-fill"
            @click="
              account = '';
              password = '';
            "
            color="#999"
          ></u-icon>
        </view>
      </u-input>
    </view>
    <view class="login-form-password">
      <u-input
        placeholder="请输入密码"
        prefixIcon="lock"
        v-model="password"
        prefixIconStyle="font-size: 22px;color: #909399"
        shape="circle"
        password
        class="uInput"
      >
        <view slot="suffix" class="ipnut-icon-view" @click="password = ''">
          <u-icon
            name="close-circle-fill"
            @click="password = ''"
            color="#999"
          ></u-icon>
        </view>
      </u-input>
    </view>
    <view class="login_keep_wrap" for="keep">
      <u-checkbox-group v-model="isKeep">
        <u-checkbox id="keep" label="记住我" name="keep">记住我</u-checkbox>
      </u-checkbox-group>
      <view> </view>
    </view>
    <view class="login-btn">
      <u-button @click="getUserProfile" shape="circle" color="#70A4F8">
        登录
      </u-button>
    </view>
  </view>
</template>

<script>
import mineTitle from "../../components/mineTitle/mineTitle.vue";
export default {
  data() {
    return {
      account: "", //账号
      password: "", // 密码
      isKeep: [], // 是否记住
    };
  },
  components: { mineTitle },
  onLoad: function (option) {
    // 判断是否已经登录过
    const token = uni.getStorageSync("token") || "";
    if (token) {
      uni.switchTab({
        url: "../home/index",
      });
      return;
    }
    // 判断缓存中是否存在登录信息
    const loginInfo = uni.getStorageSync("loginInfo");
    // 如果存在 则放到登录表单上
    if (loginInfo) {
      const { account, password } = loginInfo;
      this.account = account;
      this.password = password;
      this.isKeep.push("keep");
    }
  },
  methods: {
    /**
     * 跳转到登录界面
     */
    async submitLogin() {
      // 1. 校验是否已经输入用户名或密码
      if (this.account === "" || this.password === "") {
        uni.showToast({
          title: "请输入账号或密码",
          icon: "error",
          mask: false,
        });
        return;
      }
      // 2. 调用接口进行登录操作
      await this.service.user.login(this.account, this.password);
      await this.service.user.getCurrentUser();
      await this.service.base.getCustomTel();
      // 3. 登录成功后 判断是否需要进行账号和密码的缓存
      if (this.isKeep[0] === "keep") {
        uni.setStorageSync("loginInfo", {
          account: this.account,
          password: this.password,
        });
      } else {
        // 清空登录信息缓存
        uni.removeStorageSync("loginInfo");
      }
      // 4. 登录成功后 跳转到工作区界面
      uni.showToast({
        title: "登录成功",
        mask: false,
        duration: 1000,
      });
      setTimeout(() => {
        uni.switchTab({
          url: "../home/index",
        });
      }, 1000);
    },
    // 获取用户信息
    getUserProfile(e) {
      const that = this;
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      // 1. 判断是否已经授权过用户信息
      const userInfo_wx = uni.getStorageSync("userInfo_wx");
      if (userInfo_wx) {
        that.submitLogin();
        return;
      }
      wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("getUserProfile", res);
          uni.setStorageSync("userInfo_wx", res.userInfo);
        },
        complete() {
          that.submitLogin();
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.auth-wrap {
  padding: 100upx 100upx;
}
.login-form-user {
  margin-top: 100upx;
  background-color: #f4f4f4;
  border-radius: 50upx;
}
.login-form-password {
  margin-top: 50upx;
  background-color: #f4f4f4;
  border-radius: 50upx;
}
.login_keep_wrap {
  margin-top: 50upx;
  margin-left: 30upx;
}
.login-btn {
  margin-top: 50upx;
}
.ipnut-icon-view {
  width: 60upx;
  height: 48upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/deep/.u-icon__icon {
  font-size: 30upx;
}
</style>
