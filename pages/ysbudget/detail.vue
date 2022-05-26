<!--
 * @Descripttion: 预算申请详情
 * @Author: jsw丶郁
 * @Date: 2022-04-02 16:18:44
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 17:04:39
-->
<template>
  <mine-layout
    :btnList="applyBtnList"
    @handleBtn="submitapply"
    :isShowBtn="isShowBtn"
    v-if="isSuccess"
  >
    <view
      class="apply-detail-wrap jjy-font-size"
      :class="{ 'apply-detail-wrap-null': isShowBtn }"
    >
      <mine-steps :stepObj="stepObj" :billType="type"></mine-steps>
      <!--顶部信息-->
      <view class="apply-detail-content">
        <mine-collapse title="单据信息" :showIcon="false">
          <!--标题-->
          <mine-badge slot="left" :status="budgetObj.urgency">
            <text style="min-height: 30rpx">
              {{ budgetObj.urgencyDescr || "" }}
            </text>
          </mine-badge>
          <!--详情信息-->
          <view class="detail">
            <view>
              <text class="left-label-view">单号：</text>
              <view class="center-value-view">
                <view class="row-filed-view">
                  <text>{{ budgetObj.billNo || "" }}</text>
                  <text class="no">{{ budgetObj.statusDescr || "" }}</text>
                </view>
              </view>
            </view>
            <view>
              <text class="left-label-view">合同编码：</text>
              <view class="center-value-view">
                <text>
                  {{ budgetObj.stkId || "" }}-{{ budgetObj.stkIdDescr || "" }}
                </text>
              </view>
            </view>
            <view>
              <text class="left-label-view grayText">地址：</text>
              <text class="center-value-view grayText">
                {{ budgetObj.shopAddr || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view grayText">联系人：</text>
              <mine-contact
                class="center-value-view grayText"
                :consignee="budgetObj.consignee || ''"
                :phone="budgetObj.shopTel || ''"
              ></mine-contact>
            </view>
            <view>
              <text class="left-label-view grayText">名称：</text>
              <text class="center-value-view grayText">
                {{ budgetObj.className || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view">故障描述：</text>
              <text class="center-value-view">
                {{ budgetObj.remark || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view">备注：</text>
              <text class="center-value-view">
                {{ budgetObj.remark1 || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view">故障照片：</text>
              <view class="center-value-view"> </view>
            </view>
          </view>
          <view class="bottomAblum">
            <mine-album :imageArr="budgetObj.annexes"></mine-album>
          </view>
        </mine-collapse>
      </view>
      <!--抢单输入内容-->
      <view class="apply-grad-content">
        <mine-collapse title="供应商信息" :showIcon="false">
          <!--输入的表单控件  -->
          <view
            class="grad-form-wrap"
            v-if="!isDetail && budgetObj.status === '0'"
          >
            <!--左侧的表单label视图-->
            <view class="left-label-view">
              <view class="flex-text">
                <text class="require-filed">*</text>供应商</view
              >
              <view class="flex-text"
                ><text class="require-filed">*</text>预计到达时间</view
              >
              <view class="flex-text"
                ><text class="require-filed">*</text>维修人员姓名</view
              >
              <view class="flex-text"
                ><text class="require-filed">*</text>维修人员电话</view
              >
              <view class="flex-text"
                ><text class="require-filed">*</text>预算金额</view
              >
            </view>
            <!--右侧的表单输入框视图-->
            <view class="right-input-view">
              <view>
                <u--input
                  v-model="vendorInfo"
                  disabled
                  disabledColor="#f4f4f4"
                ></u--input>
              </view>
              <view class="pickerTime u-border">
                <u--input
                  :border="border"
                  placeholder="请选择上门时间"
                  v-model="submitBudget.arrivalDate"
                  type="select"
                  :select-open="pickerTime"
                  disabled="true"
                  disabledColor="#f4f4f4"
                ></u--input>
                <u-icon name="order" @click="pickerTime = true" size="28px">
                </u-icon>
              </view>
              <view>
                <u--input
                  placeholder="请填写维修人员姓名"
                  clearable
                  v-model="submitBudget.repairName"
                ></u--input>
              </view>
              <view>
                <u--input
                  placeholder="请填写维修人员手机号"
                  clearable
                  v-model="submitBudget.repairTel"
                  type="number"
                ></u--input
              ></view>
              <view>
                <u--input
                  placeholder="请填写预算金额"
                  clearable
                  v-model="submitBudget.budgetAmt"
                  type="digit"
                ></u--input>
              </view>
            </view>
          </view>
          <!--不需要编辑的视图-->
          <view class="detail" v-else>
            <view>
              <text class="left-label-view">供应商：</text>
              <view class="center-value-view">
                {{ budgetObj.vendorId || "" }}
                {{ budgetObj.vendorName || "" }}
              </view>
            </view>
            <view>
              <text class="left-label-view">预计到达时间：</text>
              <text class="center-value-view">
                {{ budgetObj.arrivalDate || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view">维修人员姓名：</text>
              <text class="center-value-view">
                {{ budgetObj.repairName || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view">维修人员手机：</text>
              <mine-contact
                class="center-value-view"
                :phone="budgetObj.repairTel || ''"
              ></mine-contact>
            </view>
            <view>
              <text class="left-label-view special-text">预算金额：</text>
              <text class="center-value-view special-text">
                ￥{{ budgetObj.budgetAmt || 0 }}
              </text>
            </view>
          </view>
        </mine-collapse>
      </view>
      <u-datetime-picker
        mode="datetime"
        :show="pickerTime"
        v-model="pickerTimeVal"
        @confirm="confirm"
        @cancel="closeDateTime"
        title="预计到达时间"
      ></u-datetime-picker>
    </view>
  </mine-layout>
</template>

<script>
import MineAlbum from "../../components/mineAlbum/mineAlbum.vue";
import MineBadge from "../../components/mineBadge/mineBadge.vue";
import MineCollapse from "../../components/mineCollapse/mineCollapse.vue";
import MineContact from "../../components/mineContact/mineContact.vue";
import MineLayout from "../../components/mineLayout/mineLayout.vue";
import MineSteps from "../../components/mineSteps/mineSteps.vue";
import func from "../../mixin/func.vue";
export default {
  mixins: [func],
  data() {
    return {
      isDetail: false,
      isShowBtn: false,
      applyBtnList: [],
      pickerTime: false,
      pickerTimeVal: new Date(),
      submitBudget: {
        arrivalDate: "",
        repairName: "",
        repairTel: "",
        budgetAmt: "",
      },
      budgetObj: {},
      isSuccess: false,
      stepObj: {},
    };
  },
  components: {
    MineLayout,
    MineCollapse,
    MineAlbum,
    MineBadge,
    MineContact,
    MineSteps,
  },
  computed: {
    vendorInfo() {
      return this.budgetObj.vendorId + " " + this.budgetObj.vendorName;
    },
  },
  onLoad: function (option) {
    const { billno } = option;
    this.getbudgetDetail(billno);
  },
  methods: {
    confirm(e) {
      const timeFormat = uni.$u.timeFormat;
      console.log(timeFormat(new Date(e.value), "yyyy-mm-dd hh:MM"));
      this.submitBudget.arrivalDate = timeFormat(
        new Date(e.value),
        "yyyy-mm-dd hh:MM"
      );
      this.pickerTime = false;
      // console.log(timeFormat(e.value, 'yyyy-mm'))
    },
    closeDateTime() {
      this.pickerTime = false;
    },
    async getbudgetDetail(billno) {
      const res = await this.service.budget.getBudgetByBillNO(billno);
      this.budgetObj = res.data;
      const {
        arrivalDate = "",
        repairName = "",
        repairTel = "",
        budgetAmt = "",
      } = res.data;
      this.submitBudget = {
        arrivalDate,
        repairName,
        repairTel,
        budgetAmt,
      };
      const status = ["0", "9"];
      // 1. 判断是否显示按钮 只有审核中和草稿状态 才能显示出按钮
      const isShowBtn = status.some((item) => res.data.status === item)
        ? this.rightObj.chkright
        : false;

      this.isShowBtn = isShowBtn;
      // 2. 判断是否可编辑 用户类型为供应商类型可编辑, 否则不可编辑
      if (this.userType === "0") {
        this.isDetail = true;
        if (res.data.status === "0" && isShowBtn) {
          this.isShowBtn = false;
        }
      }
      // 3. 判断是否有审核权限 判断当前状态 审核中 9->显示审核按钮，草稿状态 0->显示确认并审核
      if (isShowBtn && res.data.status === "9") {
        const isChkright = await this.service.budget.checkApproveBudget(billno);
        this.isShowBtn = isChkright.data;
        this.applyBtnList = [
          {
            name: "拒绝",
            type: "no",
            background: "#F87070",
            isDisabled: false,
          },
          {
            name: "审批",
            type: "yes",
            background: "#70A4F8",
            isDisabled: false,
          },
        ];
      } else if (isShowBtn && res.data.status === "0") {
        this.applyBtnList = [
          {
            name: "确认并审核",
            type: "ok",
            background: "#70A4F8",
            isDisabled: false,
          },
        ];
      }
      await this.getFlowProgress(billno);
      this.isSuccess = true;
    },
    async submitapply(type) {
      const billno = this.budgetObj.billNo;
      let isSuccess = false;
      switch (type) {
        case "ok":
          const data = this.submitBudget;
          // 校验不可为空
          if (data.arrivalDate === "") {
            uni.showToast({
              title: "预计到达时间不可为空",
              icon: "none",
            });
            return;
          }
          if (data.repairName === "") {
            uni.showToast({
              title: "维修人姓名不可为空",
              icon: "none",
            });
            return;
          }
          if (data.repairTel === "") {
            uni.showToast({
              title: "维修人员电话不可为空",
              icon: "none",
            });
            return;
          }
          if (data.budgetAmt === "") {
            uni.showToast({
              title: "预算金额不可为空",
              icon: "none",
            });
            return;
          }
          await this.service.budget.submitAndApprove(billno, data);
          uni.showToast({
            title: "确认并审核成功",
            icon: "none",
            duration: 1000,
          });
          isSuccess = true;
          break;
        case "yes":
          await this.service.budget.approveBudget(billno, "1");
          uni.showToast({
            title: "审核成功",
            icon: "none",
            duration: 1000,
          });
          isSuccess = true;
          break;
        case "no":
          await this.service.budget.approveBudget(billno, "2");
          uni.showToast({
            title: "拒绝成功",
            icon: "none",
            duration: 1000,
          });

          isSuccess = true;
          break;
      }
      if (isSuccess) {
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 1000);
      }
    },
    async getFlowProgress(billno) {
      const { permissionList } = this.userInfo;
      const billCode = permissionList.filter(
        (item) => item.funcno === this.type
      )[0].billCode;
      const res = await this.service.base.getFlowProgress(billCode, billno);
      this.stepObj = res;
    },
  },
};
</script>

<style scoped lang="scss">
text {
  display: block;
  min-height: 40upx;
}
.apply-detail-wrap {
  background: $jjy-zcwx-bg;
  padding: 10upx;
  height: calc(100vh - 20upx);
  overflow: auto;
  .apply-detail-content {
    background: #fff;
    .detail {
      color: $jjy-zcwx-gray-2;
      padding-top: 10upx;
      border-top: 1upx solid #cccccc;
      width: 720upx;
      .special-text {
        color: $jjy-zcwx-main;
      }
      view {
        display: flex;
        flex-direction: row;
        margin-bottom: 5upx;
        .grayText {
          color: $jjy-zcwx-gray;
        }
        .left-label-view {
          display: flex;
          flex-direction: column;
          text-align: right;
          width: 160upx;
          .grayText {
            color: $jjy-zcwx-gray;
          }
        }
        .center-value-view {
          flex: 1;
          display: flex;
          flex-direction: row;
          text-align: left;
          .row-filed-view {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-right: 5upx;
          }
        }
      }
    }
  }
  .bottomAblum {
    width: 720upx;
  }
  .apply-grad-content {
    background: #fff;
    margin-top: 20upx;
    // 输入视图
    .grad-form-wrap {
      display: flex;
      flex-direction: row;
      color: $jjy-zcwx-gray-2;
      width: 720upx;
      border-top: 1rpx solid #cccccc;
      padding: 24upx 0;
      .left-label-view {
        display: flex;
        flex-direction: column;
        text-align: right;
        margin-right: 20upx;
        .flex-text {
          display: flex;
          flex-direction: row;
          height: 38px;
          margin-bottom: 10upx;
          line-height: 38px;
          justify-content: flex-end;
        }
      }
      .right-input-view {
        flex: 1;
        padding-right: 20upx;
        view {
          margin-bottom: 10upx;
          background: $jjy-zcwx-bg;
        }
        .pickerTime {
          display: flex;
          flex-direction: row;
        }
      }
    }
    // 显示视图
    .detail {
      color: $jjy-zcwx-gray-2;
      width: 720upx;
      padding: 10upx 0;
      border-top: 1rpx solid #cccccc;
      .special-text {
        color: $jjy-zcwx-main;
      }
      view {
        display: flex;
        flex-direction: row;
        margin-bottom: 5upx;
        .left-label-view {
          display: flex;
          flex-direction: column;
          text-align: right;
          min-width: 220upx;
        }
        .center-value-view {
          flex: 1;
          display: flex;
          flex-direction: row;
          text-align: left;
        }
      }
    }
  }
}
.apply-detail-wrap-null {
  height: calc(100vh - 80px);
}

/deep/picker-view {
  width: 100%;
  height: 600upx;
}
</style>
