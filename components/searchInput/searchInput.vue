<!--
 * @Descripttion: 自定义查询组件
 * @Author: jsw丶郁
 * @Date: 2022-03-25 09:28:24
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-21 09:24:42
-->
<template>
  <view class="search_wrap">
    <text class="search_text" v-if="isText">{{ searchText }}:</text>
    <view class="search_input">
      <input
        :placeholder="placeholder"
        placeholder-style="color:#ccc"
        :value="searchValue"
        @input="inputChange"
        @focus="focusInput"
        @blur="blurInput"
        confirm-type="search"
        @confirm="inputConfirm"
      />
      <view class="search_scan" v-show="isShowSearch" @click="hanlerImg">
        <u-icon
          id="scan"
          :name="searchIcon"
          color="#999999"
          size="30px"
        ></u-icon>
      </view>
      <view
        v-show="!isShowSearch && searchValue !== ''"
        class="search_view jjy-font-size"
        @click="searchBtn"
      >
        搜索
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      isShowSearch: true,
    };
  },
  props: {
    // 是否显示左边的文字
    isText: {
      type: Boolean,
      default: false,
    },
    // 查询组件的左侧文本
    searchText: {
      type: String,
      default: "名称或编码",
    },
    // 文本提示语
    placeholder: {
      type: String,
      default: "名称或编码",
    },
    // 查询组件文本框内的图标 scan search
    searchIcon: {
      type: String,
      default: "search",
    },
    /**
     * 查询类型有两种
     *   1 search 直接在输入框输入查询
     *   2 scan   打开手机摄像头扫码查询
     *  */

    searchType: {
      type: String,
      default: "search",
    },
  },
  methods: {
    /**
     * 输入框值改变
     *   设置双向绑定
     */
    inputChange(e) {
      this.searchValue = e.detail.value;
      this.isScan();
    },
    // 获取焦点
    focusInput() {
      this.isScan();
    },
    // 失去焦点
    blurInput() {
      this.isScan();
    },
    isScan() {
      if (this.searchValue === "") {
        this.isShowSearch = true;
      } else {
        this.isShowSearch = false;
      }
    },
    /**
     * 搜索按钮处理方法
     */
    searchBtn(aaa) {
      this.$emit("handlerImg", this.searchValue);
      this.clearSerach();
    },
    inputConfirm(event) {
      this.$emit("handlerImg", event.detail.value);
      this.clearSerach();
    },
    /**
     * 点击右侧的字体图标
     */
    hanlerImg() {
      let that = this;
      if (this.searchType !== "scan") {
        this.$emit("handlerImg", this.searchValue);
        return;
      }
      uni.scanCode({
        scanType: ["barCode", "qrCode"],
        success: function (res) {
          that.searchValue = res.result;
          that.$emit("handlerImg", that.searchValue);
        },
        fail: function (err) {
          //失败之后的回调
          console.log(err);
          uni.showToast({
            title: "扫码失败",
            icon: "error",
          });
        },
        complete: function () {
          that.clearSerach();
        },
      });
    },
    /**
     * 清空search
     */
    clearSerach() {
      setTimeout(() => {
        this.searchValue = "";
        this.isShowSearch = true;
      }, 500);
    },
  },
};
</script>

<style scope lang="scss">
.search_wrap {
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  height: 70rpx;
}
.search_text {
  flex: 1.5;
  line-height: 70rpx;
  text-align: right;
  padding-right: 10rpx;
}
.search_input {
  flex: 4;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 2rpx solid #fff;
  line-height: 58rpx;
  padding-left: 10upx;
  border-radius: 10upx;
}
.search_input input {
  height: 58rpx;
  width: 100%;
}
.search_input image {
  width: 60rpx;
  height: 60rpx;
}
.search_scan {
  width: 100upx;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.search_view {
  background: $jjy-zcwx-main;
  width: 100rpx;
  line-height: 60rpx;
  transition: 0.4s;
  text-align: center;
  color: #fff;
}
</style>
