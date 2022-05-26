<!--
 * @Descripttion: 自定义的折叠面板
 * @Author: jsw丶郁
 * @Date: 2022-04-02 11:03:36
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 16:32:41
-->
<template>
  <view class="collapse-view-wrap">
    <!--折叠面板标题栏-->
    <view class="collapse-title-wrap" @click="collapseClick">
      <!--左侧标题栏-->
      <view class="left-title-view">
        <view class="left-border"></view>
        <text class="title jjy-font-size">{{ title }}</text>
        <view class="left-content-view">
          <slot name="left"></slot>
        </view>
      </view>
      <!--右侧内容信息-->
      <view class="right-content-view">
        <slot name="right"></slot>
        <view v-if="showIcon">
          <u-icon
            name="arrow-up"
            color="#333333"
            size="28"
            v-if="collapse"
          ></u-icon>
          <u-icon name="arrow-down" color="#333333" size="28" v-else></u-icon>
        </view>
      </view>
    </view>
    <!--中间内容区域-->
    <view class="collapse-content-wrap" v-show="collapse">
      <slot></slot>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "默认标题",
    },
    isCollapse: {
      type: Boolean,
      default: true,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      collapse: this.isCollapse,
    };
  },
  methods: {
    collapseClick() {
      this.collapse = !this.collapse;
    },
  },
};
</script>
<style lang="scss" scoped>
.collapse-view-wrap {
  .collapse-title-wrap {
    padding: 10upx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left-title-view {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      font-weight: bold;
      flex: 1;
      .left-border {
        height: 40upx;
        width: 2pt;
        border-radius: 1pt;
        background: $jjy-zcwx-main;
        bottom: 0;
        left: 0;
      }
      .title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 10upx;
      }
      .left-content-view {
        padding-left: 10upx;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }
    .right-content-view {
      padding-right: 10upx;
      min-width: 120upx;
    }
  }
  .collapse-content-wrap {
    max-width: 720upx;
  }
}
</style>
