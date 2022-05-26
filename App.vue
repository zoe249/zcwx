<!--
 * @Descripttion: 
 * @Author: jsw丶郁
 * @Date: 2022-03-25 15:13:45
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-05 16:57:57
-->
<script>
export default {
  onLaunch: function () {
    // 隐藏原生tabbar
    uni.hideTabBar();
    console.log("App Launch");
  },
  onShow: async function () {
    console.log("应用onshow");
    uni.hideTabBar();
    const token = uni.getStorageSync("token") || "";
    if (token) {
      await this.service.user.refreshToken();
    } else {
      uni.reLaunch({
        url: "./pages/login/index",
      });
    }
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
/** 字体样式 */
/** 默认适中 */
.jjy-font-size {
  font-size: 32upx;
}
/** 字体较大 */
.jjy-font-size-big {
  font-size: 40upx;
}
/** 字体较小 */
.jjy-font-size-small {
  font-size: 29upx;
}

/** 边框弧度 */
.jjy-border-radius {
  border-radius: 15upx;
}

/** 派送或已派送 */
/** 未指派 */
.no {
  color: $jjy-zcwx-pink;
}
/** 供应商维修中 */
.ok {
  color: $jjy-zcwx-blue;
}

/** 特殊颜色*/
.special-text {
  color: $jjy-zcwx-main;
}
/** 必填字段 */
.require-filed {
  color: $jjy-zcwx-pink;
}

/** 紧急背景色 */
.urgency {
  background-color: rgba(248, 112, 112, 0.2);
}
</style>
