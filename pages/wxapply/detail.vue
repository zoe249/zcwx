<!--
 * @Descripttion: 维修单的详情页面和维修单的抢单页面
 * @Author: jsw丶郁
 * @Date: 2022-04-02 11:16:55
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-11 13:57:31
-->
<template>
  <mine-layout
    :btnList="applyBtnList"
    @handleBtn="submitapply"
    :isShowBtn="isShowBtn"
    v-if="isSuccess"
  >
    <view class="apply-detail-wrap jjy-font-size">
      <view
        class="apply-detail-content-wrap"
        :class="{ 'apply-detail-content': isShowBtn }"
      >
        <mine-steps
          v-if="isDetail"
          :stepObj="stepObj"
          :billType="type"
        ></mine-steps>
        <!--顶部信息-->
        <view class="apply-top-content">
          <mine-collapse title="单据信息" :showIcon="false">
            <!--标题-->
            <text
              slot="right"
              :class="applyObj.flowstatus === '0' ? 'no' : 'ok'"
            >
              <!--单据状态信息-->
              {{ applyObj.flowstatusDescr || "" }}
            </text>
            <!--详情信息-->
            <view class="detail">
              <!--左侧的字段名视图-->
              <view class="label-item">
                <!--右边的其他视图-->
                <text class="left-label-view">单号：</text>
                <view class="right-order-view">
                  <text>{{ applyObj.billno || "" }}</text>
                  <text class="no">{{ applyObj.statusDescr || "" }}</text>
                </view>
              </view>
              <view class="label-item">
                <text class="left-label-view">门店：</text>
                <text class="center-value-view">
                  {{ applyObj.stkid || "" }} -{{ applyObj.stkidDescr || "" }}
                </text>
              </view>

              <view class="label-item" v-if="!isDetail">
                <text class="left-label-view">门店地址：</text>
                <text class="center-value-view">
                  {{ applyObj.shopaddr || "" }}
                </text>
              </view>
              <view class="label-item">
                <text class="left-label-view">联系信息：</text>
                <mine-contact
                  class="center-value-view"
                  :consignee="applyObj.consignee || ''"
                  :phone="applyObj.shoptel || ''"
                ></mine-contact>
              </view>
              <view class="label-item">
                <text class="left-label-view">申请时间：</text>
                <text class="center-value-view">
                  {{ applyObj.createtime || "" }}
                </text>
              </view>
              <view class="label-item">
                <text class="left-label-view">名称：</text>
                <text class="center-value-view">
                  {{ applyObj.className || "" }}
                </text>
              </view>
              <view class="label-item">
                <text class="left-label-view">故障描述：</text>
                <text class="center-value-view">
                  {{ applyObj.remark || "" }}
                </text>
              </view>
              <view class="label-item">
                <text class="left-label-view">备注：</text>
                <text class="center-value-view">
                  {{ applyObj.remark1 || "" }}
                </text>
              </view>
              <view class="label-item">
                <text class="left-label-view">故障照片：</text>
                <text class="center-value-view"></text>
              </view>
            </view>
            <view class="bottomAblum">
              <mine-album :imageArr="applyObj.annexes"></mine-album>
            </view>
          </mine-collapse>
        </view>
        <!--抢单输入内容-->
        <view class="apply-grad-content" v-if="!isDetail">
          <mine-collapse title="接单需填写" :showIcon="false">
            <!--抢单的表单控件-->
            <view class="grad-form-wrap">
              <!--左侧的表单label视图-->
              <view class="left-label-view">
                <text class="flex-text">
                  <text class="require-filed">*</text>供应商编码</text
                >
                <text class="flex-text">
                  <text class="require-filed">*</text>预计到达时间</text
                >
                <text class="flex-text">
                  <text class="require-filed">*</text>维修人员姓名</text
                >
                <text class="flex-text">
                  <text class="require-filed">*</text>维修人员电话</text
                >
              </view>
              <!--右侧的表单输入框视图-->
              <view class="right-input-view">
                <text v-if="userType === '1'">
                  {{ userInfo.userid || "" }}-{{ userInfo.username || "" }}
                </text>
                <view v-else>
                  <u--input
                    placeholder="请填写供应商编码"
                    clearable
                    v-model="submitData.vendorid"
                    border="none"
                  ></u--input>
                </view>
                <view class="pickerTime">
                  <u--input
                    border="none"
                    placeholder="选择上门时间"
                    v-model="submitData.arrivalDate"
                    type="select"
                    :select-open="pickerTime"
                    disabled
                    disabledColor="#f4f4f4"
                  ></u--input>
                  <u-icon name="order" @click="pickerTime = true" size="28px">
                  </u-icon>
                </view>
                <view>
                  <u--input
                    placeholder="请填写维修人员姓名"
                    clearable
                    v-model="submitData.repairname"
                    border="none"
                  ></u--input>
                </view>
                <view>
                  <u--input
                    placeholder="请填写维修人员电话"
                    clearable
                    v-model="submitData.repairtel"
                    type="number"
                    border="none"
                  ></u--input
                ></view>
              </view>
            </view>
          </mine-collapse>
        </view>
        <u-datetime-picker
          mode="datetime"
          :show="pickerTime"
          v-model="time"
          @confirm="confirm"
          @cancel="closeDateTime"
          title="选择上门时间"
        ></u-datetime-picker>
      </view>
    </view>
  </mine-layout>
</template>

<script>
import MineAlbum from "../../components/mineAlbum/mineAlbum.vue";
import MineCollapse from "../../components/mineCollapse/mineCollapse.vue";
import MineContact from "../../components/mineContact/mineContact.vue";
import MineLayout from "../../components/mineLayout/mineLayout.vue";
import MineSteps from "../../components/mineSteps/mineSteps.vue";
import func from "../../mixin/func.vue";
export default {
  mixins: [func],
  data() {
    return {
      isDetail: true, //单据类型  detail 详情(判断是否需要审核)  grab 抢单
      isShowBtn: false,
      pickerTime: false,
      submitData: {
        arrivalDate: "",
        repairtel: "",
        repairname: "",
        vendorid: "",
      },
      applyObj: {},
      time: new Date(),
      isSuccess: false,
      stepObj: {}, //当前单据步骤
    };
  },
  components: { MineLayout, MineCollapse, MineAlbum, MineContact, MineSteps },
  computed: {
    applyBtnList() {
      const grabBtn = [
        {
          name: this.userType === "0" ? "确认指派" : "确认接单",
          type: "ok",
          background: "#70A4F8",
          isDisabled: false,
        },
      ];
      const detailBtn = [
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
      return this.isDetail ? detailBtn : grabBtn;
    },
  },
  onLoad: function (option) {
    this.isDetail = option.isDetail == "true" ? true : false;
    const title = this.userType === "0" ? "指派" : "抢单";
    uni.setNavigationBarTitle({
      title: this.isDetail ? "维修申请详情" : title,
    });

    this.getApplyDetail(option.billno);
  },
  methods: {
    confirm(e) {
      const timeFormat = uni.$u.timeFormat;
      console.log(timeFormat(new Date(e.value), "yyyy-mm-dd hh:MM"));
      this.submitData.arrivalDate = timeFormat(
        new Date(e.value),
        "yyyy-mm-dd hh:MM"
      );
      this.pickerTime = false;
    },
    closeDateTime() {
      this.pickerTime = false;
    },
    async submitapply(type) {
      const billno = this.applyObj.billno;
      let isSuccess = false;
      switch (type) {
        case "ok":
          if (this.userType === "1") {
            this.submitData.vendorid = this.userInfo.userid;
          }
          const data = this.submitData;
          // 校验不可为空
          if (data.arrivalDate === "") {
            uni.showToast({
              title: "预计到达时间不可为空",
              icon: "none",
            });
            return;
          }
          if (data.vendorid === "") {
            uni.showToast({
              title: "供应商编码不可为空",
              icon: "none",
            });
            return;
          }
          if (data.repairtel === "") {
            uni.showToast({
              title: "维修人员电话不可为空",
              icon: "none",
            });
            return;
          }
          if (data.repairname === "") {
            uni.showToast({
              title: "维修人员姓名不可为空",
              icon: "none",
            });
            return;
          }
          await this.service.apply.grabApplyBills(billno, data);
          uni.showToast({
            title: this.userType === "0" ? "指派成功" : "接单成功",
            icon: "none",
            duration: 2500,
            mask: true,
          });
          isSuccess = true;
          break;
        case "yes":
          await this.service.apply.approveApply(billno, "1");
          uni.showToast({
            title: "审核成功",
            icon: "none",
            duration: 2500,
            mask: true,
          });
          isSuccess = true;
          break;
        case "no":
          await this.service.apply.approveApply(billno, "2");
          uni.showToast({
            title: "拒绝成功",
            icon: "none",
            duration: 2500,
            mask: true,
          });

          isSuccess = true;
          break;
      }
      if (isSuccess) {
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, 2500);
      }
    },
    async getApplyDetail(billno) {
      const res = await this.service.apply.getApplyByBillNO(billno);
      this.applyObj = res.data;
      // 是否是查询
      if (this.isDetail) {
        // 是否可审核 有审核权限 状态是审核中9 有当前单据的审核
        const isChkright = await this.service.apply.checkApproveApply(billno);
        this.isShowBtn =
          this.rightObj.chkright &&
          this.applyObj.status === "9" &&
          isChkright.data;
      } else {
        // 是否可抢单
        this.isShowBtn = true;
      }
      await this.getFlowProgress(billno);
      this.isSuccess = true;
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
/deep/.mine-layout-wrap {
  background: $jjy-zcwx-bg;
}
.apply-detail-wrap {
  background: $jjy-zcwx-bg;
  height: 100%;
  padding: 0;
  margin: 0;
  .apply-detail-content-wrap {
    height: calc(100% - 20upx);
    padding: 10upx;
    overflow: auto;
    .apply-top-content {
      background: #fff;
      .detail {
        color: #333333;
        // display: flex;
        // flex-direction: row;
        .label-item {
          display: flex;
          flex-direction: row;
          padding-top: 10upx;
          .left-label-view {
            width: 160upx;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .center-value-view {
            flex: 5;
            padding-right: 20upx;
          }
          .right-order-view {
            flex: 5;
            display: flex;
            flex-direction: row;
            text-align: right;
            padding-right: 20upx;
            justify-content: space-between;
          }
        }
      }
    }
    .apply-grad-content {
      background: #fff;
      margin-top: 20upx;
      .grad-form-wrap {
        display: flex;
        flex-direction: row;
        color: $jjy-zcwx-gray-2;
        .left-label-view {
          display: flex;
          flex-direction: column;
          text-align: right;
          margin-right: 20upx;
          .flex-text {
            display: block;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 38px;
            margin-bottom: 20upx;
          }
        }
        .right-input-view {
          flex: 1;
          padding-right: 20upx;
          view {
            margin-bottom: 20upx;
            background: #f4f4f4;
            height: 38px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0upx 9px;
          }
          text {
            display: block;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 38px;
            margin-bottom: 20upx;
          }
          .pickerTime {
            display: flex;
            flex-direction: row;
            background: #f4f4f4;
            /dee/.u-input {
              background-color: #f4f4f4;
            }
          }
        }
      }
    }
  }
  .apply-detail-content {
    height: calc(100vh - 80px);
  }
}

/deep/picker-view {
  width: 100%;
  height: 600upx;
}
</style>
