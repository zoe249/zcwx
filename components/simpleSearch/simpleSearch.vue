<!--
 * @Descripttion: 简单的搜索组件
 * @Author: jsw丶郁
 * @Date: 2022-03-31 10:03:07
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-25 16:03:56
-->
<template>
  <view class="simple-search-wrap">
    <view class="left-input">
      <u-input
        :placeholder="placeholder"
        prefixIcon="search"
        prefixIconStyle="font-size: 22px;color: #909399"
        v-model="searchValue"
      >
        <view slot="suffix" v-show="searchValue">
          <u-icon name="close-circle-fill" @click="clear" color="#999"></u-icon>
        </view>
      </u-input>
    </view>
    <view class="right-btn" @click="search"> 搜索 </view>
  </view>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入商品名称或商品编码",
    },
    shape: {
      // square circle
      type: String,
      default: "circle",
    },
  },
  data() {
    return {
      searchValue: "",
    };
  },
  methods: {
    search() {
      this.$emit("handleSearch", this.searchValue);
    },
    clear() {
      this.searchValue = "";
      this.$emit("handleSearch", "");
    },
  },
};
</script>
<style lang="scss" scoped>
.simple-search-wrap {
  display: flex;
  flex-direction: row;
}
.left-input {
  flex: 1;
  background: #fff;
  border-radius: 4px;
}

.right-btn {
  margin-left: 24upx;
  width: 130upx;
  color: #fff;
  text-align: center;
  background: $jjy-zcwx-main;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15upx;
}
</style>
