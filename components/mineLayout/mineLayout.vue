<!--
 * @Descripttion: 基本按钮布局
 * @Author: jsw丶郁
 * @Date: 2022-03-31 11:16:22
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-05 16:59:33
-->
<template>
  <view class="mine-layout-wrap">
    <view class="layout-main" :class="{ 'layout-main-big': !isShowBtn }">
      <slot></slot>
    </view>
    <view class="btn-wrap" v-if="isShowBtn">
      <view class="btn-item" v-for="item in btnList" :key="item.type">
        <button
          @click="handlerBtn(item.type)"
          :disabled="item.isDisabled"
          :style="{
            background: item.background,
            color: item.color || 'white',
          }"
        >
          {{ item.name }}
        </button>
      </view>
    </view>
    <float-ball></float-ball>
  </view>
</template>
<script>
export default {
  props: {
    isShowBtn: {
      // 是否显示按钮
      type: Boolean,
      default: true,
    },
    btnList: {
      //按钮数组
      type: Array,
      default: () => {
        return [
          {
            name: "确定",
            type: "ok",
            background: "#70A4F8",
            isDisabled: false,
          },
        ];
      },
    },
  },
  methods: {
    handlerBtn(type) {
      this.$emit("handleBtn", type);
    },
  },
};
</script>
<style lang="scss" scoped>
.mine-layout-wrap {
  height: 100vh;
  .layout-main {
    height: calc(100vh - 70px);
  }
  .layout-main-big {
    height: 100vh;
  }
  .btn-wrap {
    height: 50px;
    width: 710upx;
    display: flex;
    flex-direction: row;
    line-height: 50px;
    padding: 10px;
    .btn-item {
      flex: 1;
    }
    .btn-item:last-child {
      margin-left: 10upx;
    }
  }
}
</style>
