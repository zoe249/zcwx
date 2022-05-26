<!--
 * @Descripttion: 自定义微标数
 * @Author: jsw丶郁
 * @Date: 2022-04-01 14:50:31
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-24 17:27:31
-->
<template>
  <text :class="status === '1' ? 'urgency' : 'daily'">
    <slot> </slot>
  </text>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
text {
  display: block;
  text-align: center;
  font-weight: 500;
  min-width: 80upx;
  padding: 5upx;
  border-radius: 50upx;
  font-size: 25upx;
}
/** 紧急 */
.urgency {
  border: 1px solid $jjy-zcwx-pink;
  color: $jjy-zcwx-pink;
  background-color: rgba(248, 112, 112, 0.2);
}
/** 日常 */
.daily {
  border: 1px solid $jjy-zcwx-blue;
  color: $jjy-zcwx-blue;
  background-color: rgba(102, 197, 215, 0.2);
}
</style>
