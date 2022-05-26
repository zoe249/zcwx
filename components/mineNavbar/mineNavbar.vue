<!--
 * @Descripttion: 自定义的顶部导航栏
 * @Author: jsw丶郁
 * @Date: 2022-05-05 14:55:41
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-05 15:15:58
-->
<template>
  <!-- 2.0.19支持autoBack，默认为false -->
  <u-navbar
    :title="title"
    @leftClick="leftClick"
    :titleStyle="{ color: '#fff' }"
    leftIconColor="#ffffff"
    bgColor="#70a4f8"
    :autoBack="true"
    leftIconSize="22px"
  >
  </u-navbar>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    leftClick() {
      this.$emit("leftClick");
    },
  },
};
</script>
