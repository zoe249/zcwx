<!--
 * @Descripttion: 自定义步骤条
 * @Author: jsw丶郁
 * @Date: 2022-05-06 15:46:42
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 16:22:48
-->
<template>
  <view class="steps">
    <view class="out-box">
      <view
        class="self-box"
        v-for="(item, index) in stepsList"
        :key="index"
        @click="goBills(item)"
      >
        <view
          class="steps-line"
          :class="{ currentLineColor: currentStep > 1 && currentStep > index }"
          v-if="index < stepsList.length - 1"
        ></view>
        <view
          class="steps-circle"
          :class="{
            currentCircleColor: currentStep > index,
            error: item.error,
          }"
        >
          <u-icon
            name="checkmark"
            color="#70A4F8"
            size="28"
            v-if="currentStep > index && !item.error"
          ></u-icon>
          <u-icon
            name="close"
            color="#F87979"
            size="28"
            v-if="item.error"
          ></u-icon>
        </view>
        <text
          :class="{ currentFontColor: currentStep > index, error: item.error }"
          >{{ item.name }}</text
        >
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    stepObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    billType: {
      //当前单据的类型
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    // 当前已处理步骤
    currentStep() {
      return this.stepObj.flowProgresNum;
    },
    stepsList() {
      let list = [
        {
          name: "维修申请",
          type: "applyStatus",
          billno: "applyBillno",
          billnoNum: "",
          permission: "applyDataPermission",
          isPermission: false,
        },
        {
          name: "分配任务",
          type: "dispatchStatus",
        },
        {
          name: "预算申请",
          type: "budgetStatus",
          billno: "budgetBillno",
          billnoNum: "",
          permission: "budgetDataPermission",
          isPermission: false,
        },
        {
          name: "维修确认",
          type: "confirmStatus",
          billno: "confirmBillno",
          billnoNum: "",
          permission: "confirmDataPermission",
          isPermission: false,
        },
      ];
      list.forEach((item) => {
        if (this.stepObj[item.type] === false) {
          item.error = true;
        }
        item.billnoNum = this.stepObj[item.billno];
        item.isPermission = this.stepObj[item.permission];
      });
      return list;
    },
  },
  methods: {
    /**
     * 单据跳转详情
     */
    goBills(item) {
      // 1. 判断点击的进度，是否就是对应当前的单据， 是-不可跳转
      if (item.billno.indexOf(this.billType.split("_")[2]) !== -1) {
        return;
      }
      // 2. 判断当前点击的进度项是否有进行跳转的单据号, 无-不可跳转
      if (!item.billnoNum) {
        return;
      }
      // 3. 判断需要进行跳转的界面
      const type = item.billno.split("Billno")[0];
      let url = "";
      switch (type) {
        case "apply":
          url =
            "../../pages/wxapply/detail?type=m_mt_apply" +
            "&isDetail=" +
            true +
            "&billno=" +
            item.billnoNum;
          break;
        case "budget":
          url =
            "../../pages/ysbudget/detail?type=m_mt_budget" +
            "&billno=" +
            item.billnoNum;
          break;
        case "confirm":
          url =
            "../../pages/wxconfirm/detail?type=m_mt_confirm" +
            "&billno=" +
            item.billnoNum;
          break;
      }
      //4. url存在且需要跳转的单据有可查询的权限

      if (url && item.isPermission) {
        uni.navigateTo({
          url,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.steps {
  height: 150rpx;
  background-color: $jjy-zcwx-bg;
  padding: 20rpx 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .out-box {
    display: flex;
    justify-content: space-between;
    width: 600rpx;
    .self-box {
      position: relative;
      width: 120rpx;
      height: 120rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .steps-circle {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        border: 2px solid $jjy-zcwx-gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .steps-line {
        width: 80rpx;
        height: 4rpx;
        background: $jjy-zcwx-gray;
        position: absolute;
        top: 25rpx;
        left: 100rpx;
      }
      text {
        margin-top: 20rpx;
        font-size: 28rpx;
        color: $jjy-zcwx-gray;
      }
      .currentFontColor {
        color: #409eff;
      }
      .currentLineColor {
        background-color: #409eff;
      }
      .currentCircleColor {
        border: 2px solid #409eff;
      }
      view.error {
        border: 2px solid #f87979;
      }
      text.error {
        color: #f87979;
      }
    }
  }
}
</style>
