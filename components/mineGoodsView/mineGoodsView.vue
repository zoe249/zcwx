<!--
 * @Descripttion: 自定义的商品view组件
 * @Author: jsw丶郁
 * @Date: 2022-04-01 16:12:57
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-18 10:09:14
-->
<template>
  <view class="apply-left-type" :class="getApplyTypeName">
    <slot></slot>
  </view>
</template>
<script>
export default {
  props: {
    classType: {
      type: String,
      default: "",
    },
  },
  computed: {
    /**
     * 获取维修类型的名称
     */
    getApplyTypeName() {
      const classList = [undefined, "equipment", "engineer", "wire"];
      return classList[this.classType];
    },
  },
};
</script>
<style lang="scss" scoped>
.apply-left-type {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
}
.equipment {
  background-color: rgba(112, 164, 248, 0.2);
  color: #70a4f8;
}
.engineer {
  background-color: rgba(102, 197, 215, 0.2);
  color: #66c5d7;
}
.wire {
  background-color: rgba(153, 152, 246, 0.2);
  color: #9998f6;
}
</style>
