<!--
 * @Descripttion: 我的单选组件
 * @Author: jsw丶郁
 * @Date: 2022-04-01 16:59:50
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-14 18:03:29
-->
<template>
  <view class="mine-radio-wrap">
    <view
      class="radio-item"
      :class="{ checked: checkValue === item.value }"
      v-for="(item, index) in radioList"
      :key="index"
      @click="radioClick(item.value, item.label)"
    >
      {{ item.label }}
    </view>
  </view>
</template>
<script>
export default {
  props: {
    radioList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    checkValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    radioClick(val, label) {
      this.$emit("radioClick", val, label);
    },
  },
};
</script>
<style lang="scss" scoped>
.mine-radio-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 25upx;
  .radio-item {
    padding: 20upx;
    min-width: 80upx;
    margin-left: 10upx;
    text-align: center;
    background: #f4f4f4;
    border-radius: 10upx;
    color: #cccccc;
  }
  .checked {
    background: $jjy-zcwx-main;
    color: #fff;
  }
}
</style>
