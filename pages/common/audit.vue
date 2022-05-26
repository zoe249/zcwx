<!--
 * @Descripttion: 公用的审核界面组件
 * @Author: jsw丶郁
 * @Date: 2022-04-06 15:02:36
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-06 16:01:21
-->
<template>
  <mine-layout :btnList="applyBtnList" @handleBtn="goSubmitAudit">
    <view class="audit-conten-wrap">
      <view class="table-row">
        <text class="table-cell left">审核级别</text>
        <text class="table-cell right">3级</text>
      </view>
      <view class="table-row">
        <text class="table-cell left">审核人</text>
        <text class="table-cell right">陈宇轩</text>
      </view>
      <view class="table-row">
        <text class="table-cell left">动作</text>
        <view class="table-cell right">
          <u-radio-group v-model="radiovalue1">
            <u-radio label="审核通过" name="1"> </u-radio>
            <u-radio label="否决作废" name="2"> </u-radio>
            <u-radio label="返回重新编辑" name="3"> </u-radio>
          </u-radio-group>
        </view>
      </view>
    </view>
    <view class="textarea-view">
      <text>审核意见</text>
      <view>
        <u--textarea
          placeholder="请填写审核意见"
          :disableDefaultPadding="true"
          style="padding: 100upx"
        >
        </u--textarea>
      </view>
    </view>
  </mine-layout>
</template>

<script>
import MineLayout from "../../components/mineLayout/mineLayout.vue";
export default {
  data() {
    return {
      applyBtnList: [
        {
          name: "取消",
          type: "ok",
          background: "#F4F4F4",
          color: "black",
          isDisabled: false,
        },
        {
          name: "确定",
          type: "ok",
          background: "#70A4F8",
          isDisabled: false,
        },
      ],
      radiovalue1: "1",
    };
  },
  components: { MineLayout },
  methods: {
    // 提交审核记录
    goSubmitAudit() {},
  },
};
</script>

<style scoped lang="scss">
.audit-conten-wrap {
  padding: 10upx;
  display: table;
  .table-row {
    display: table-row;
    height: 60upx;
    .table-cell {
      display: table-cell;
    }
    .left {
      width: 120upx;
    }
    .right {
      text-align: right;
      width: calc(100vw - 120upx);
    }
  }
}
.textarea-view {
  display: flex;
  flex-direction: row;
  text-align: left;
  width: 730upx;
  padding: 10upx;
  view {
    flex: 1;
    margin-left: 10upx;
    /deep/.u-textarea {
      background: #f4f4f4;
    }
  }
}
/deep/.u-radio-group--row {
  justify-content: flex-end;
}
/deep/.u-radio {
  margin-left: 15upx;
}
</style>
