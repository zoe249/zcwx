<!--
 * @Descripttion: 配件信息组件
 * @Author: jsw丶郁
 * @Date: 2022-04-06 09:56:44
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-22 16:02:25
-->
<template>
  <view class="acce-wrap jjy-font-size">
    <!-- 配件顶部信息-->
    <view class="acce-top-wrap">
      <view class="table-row">
        <text class="left table-cell">配件编码：</text>
        <text class="right table-cell">{{ acceList.fittingsId || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">配件名称：</text>
        <text class="right table-cell">{{ acceList.fittingsName || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">品牌：</text>
        <text class="right table-cell">{{ acceList.brand || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">型号：</text>
        <text class="right table-cell">{{ acceList.fittingsType || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">备注：</text>
        <text class="right table-cell">{{ acceList.remark || "" }}</text>
      </view>
    </view>
    <!-- 配件中间内容信息-->
    <view class="acce-centent-wrap">
      <view class="table-row">
        <text class="left table-cell">维修数量：</text>
        <text class="right table-cell">{{ acceList.itemqty || "" }}</text>
        <text class="left table-cell special">确认数量：</text>
        <text class="right table-cell special">{{
          acceList.stkfeeamt || ""
        }}</text>
        <text class="center table-cell special">{{
          acceList.extcol1 || ""
        }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">单价：</text>
        <text class="right table-cell">{{
          acceList.referencePrice || ""
        }}</text>
        <text class="left table-cell special">确认单价：</text>
        <text class="right table-cell special">{{ acceList.price || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">维修金额：</text>
        <text class="right table-cell">{{ acceList.feeamt || "" }}</text>
        <text class="left table-cell special">最终金额：</text>
        <text class="right table-cell special">{{
          acceList.confirmamt || ""
        }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      acceList: {},
    };
  },
  onLoad(options) {
    const that = this;
    // 获取 eventChannel 事件频道
    const eventChannel = this.getOpenerEventChannel();
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过事件频道 eventChannel 传送到当前页面的数据
    eventChannel.once("getAcce", function (res) {
      that.acceList = res;
    });
  },
};
</script>
<style lang="scss" scoped>
.acce-wrap {
  background: #f4f4f4;
  height: 100vh;
}
.acce-top-wrap,
.acce-centent-wrap {
  /* 设置其他元素为table元素，这样就可以在其他元素中使用table布局了。 */
  display: table;
  background: #fff;
  width: 730upx;
  padding: 10upx;
  .table-row {
    display: table-row;
    .left {
      width: 160upx;
      text-align: right;
    }
    .center {
      width: 80upx;
      text-align: center;
      padding-right: 10upx;
    }
    .special {
      color: $jjy-zcwx-main;
    }
    .table-cell {
      /* middle 当前元素放置在父元素的中部， */
      /* vertical-align: middle; */
      display: table-cell;
    }
  }
}
.acce-centent-wrap {
  margin-top: 10upx;
}
</style>
