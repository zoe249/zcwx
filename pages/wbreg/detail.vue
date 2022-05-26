<!--
 * @Descripttion: 维保登记详情
 * @Author: jsw丶郁
 * @Date: 2022-04-06 11:38:22
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-09 14:39:04
-->
<template>
  <mine-layout
    :btnList="regBtnList"
    @handleBtn="submitReg"
    :isShowBtn="isShowBtn"
    v-if="isSuccess"
  >
    <view
      class="reg-detail-wrap jjy-font-size"
      :class="{ 'reg-detail-wrap-null': isShowBtn }"
    >
      <!--顶部信息-->
      <view class="reg-detail-content">
        <mine-collapse title="单据信息" :showIcon="false">
          <!--标题 -->
          <view slot="right" @click.stop="goRate" v-if="regObj.canSelectScore">
            <u-button color="#70A4F8" text="评价"></u-button
          ></view>
          <!--详情信息-->
          <view class="detail">
            <view>
              <text class="left-label-view">单号：</text>
              <view class="center-value-view">
                <view class="row-filed-view">
                  <text>{{ regObj.billno || "" }}</text>
                  <text class="no">{{ regObj.statusDescr || "" }}</text>
                </view>
              </view>
            </view>
            <view>
              <text class="left-label-view">合同编码：</text>
              <view class="center-value-view">
                <text>{{ regObj.conId || "" }}</text>
              </view>
            </view>
            <view>
              <text class="left-label-view">生效日期：</text>
              <view class="center-value-view">
                <text>{{ regObj.execdate || "" }}</text>
              </view>
            </view>
            <view>
              <text class="left-label-view">维保日期：</text>
              <view class="center-value-view">
                <text>{{ regObj.mtDate || "" }}</text>
              </view>
            </view>
            <view>
              <text class="left-label-view">门店编码：</text>
              <view class="center-value-view">
                <text>
                  {{ regObj.stkid || "" }}-{{ regObj.stkidDescr || "" }}
                </text>
              </view>
            </view>
            <view>
              <text class="left-label-view">门店地址：</text>
              <view class="center-value-view">
                <text>{{ regObj.shopaddr || "" }}</text>
              </view>
            </view>
            <view>
              <text class="left-label-view">供应商：</text>
              <view class="center-value-view">
                {{ regObj.vendorid || "" }}
                {{ regObj.vendorname || "" }}
              </view>
            </view>
            <view>
              <text class="left-label-view">供应商联系人：</text>
              <mine-contact
                class="center-value-view"
                :consignee="regObj.connecter || ''"
                :phone="regObj.vendortel || ''"
              ></mine-contact>
            </view>
            <view>
              <text class="left-label-view">维保联系人：</text>
              <mine-contact
                class="center-value-view"
                :consignee="regObj.repairname || ''"
                :phone="regObj.repairtel || ''"
              ></mine-contact>
            </view>
            <view class="special-text">
              <text class="left-label-view">维保金额：</text>
              <text class="center-value-view"> ￥{{ regObj.mtamt || 0 }} </text>
            </view>
          </view>
        </mine-collapse>
      </view>
      <!--明细信息-->
      <view class="reg-reg-content">
        <mine-collapse title="明细信息" :showIcon="false">
          <!--确认的配件控件-->
          <view class="reg-wrap">
            <view
              class="reg-item"
              v-for="item in regObj.regDs"
              :key="item.itemId"
              for="acce"
            >
              <text>{{ item.itemId || "" }}</text>
              <text>{{ item.mtItem || "" }}</text>
              <view @click="goAcce(item, $event)" :data-res="item">
                <text class="special-text">￥{{ item.feeamt || 0 }} </text>
                <u-icon name="arrow-right" color="#999" size="20px"> </u-icon>
              </view>
            </view>
          </view>
        </mine-collapse>
      </view>
    </view>
  </mine-layout>
</template>

<script>
import MineAlbum from "../../components/mineAlbum/mineAlbum.vue";
import MineBadge from "../../components/mineBadge/mineBadge.vue";
import MineCollapse from "../../components/mineCollapse/mineCollapse.vue";
import MineContact from "../../components/mineContact/mineContact.vue";
import MineLayout from "../../components/mineLayout/mineLayout.vue";
import func from "../../mixin/func.vue";
export default {
  mixins: [func],
  data() {
    return {
      regBtnList: [
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
      ],
      regObj: {},
      isSuccess: false,
      isShowBtn: false,
    };
  },
  components: {
    MineLayout,
    MineCollapse,
    MineAlbum,
    MineBadge,
    MineContact,
  },
  onLoad: function (option) {
    const { billno } = option;
    this.getRegDetail(billno);
  },
  methods: {
    goAcce(item, event) {
		console.log(item)
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url: "./acce?status="+this.regObj.status,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("getAcce", dataRes);
        },
      });
    },
    // 跳转评价界面
    goRate() {
      const permissionList = this.userInfo.permissionList;
      const billCode = permissionList.filter(
        (item) => item.funcno === this.type
      )[0].billCode;
      const that = this;
      uni.navigateTo({
        url: "../common/rate?billCode=" + billCode,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("getBill", that.regObj);
        },
      });
    },
    async getRegDetail(billno) {
      const res = await this.service.reg.getRegBillByBillNo(billno);
      this.regObj = res.data;
      if (res.data.status === "9") {
        const isChkright = await this.service.reg.checkApproveReg(billno);
        this.isShowBtn = this.rightObj.chkright && isChkright.data;
      }
      this.isSuccess = true;
    },
    async submitReg(type) {
      const billno = this.regObj.billno;
      let isSuccess = false;
      switch (type) {
        case "yes":
          await this.service.reg.approveReg(billno, "1");
          uni.showToast({
            title: "审核成功",
            icon: "none",
            duration: 2500,
            mask: true,
          });
          isSuccess = true;
          break;
        case "no":
          await this.service.reg.approveReg(billno, "2");
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
  },
};
</script>

<style scoped lang="scss">
text {
  display: block;
  min-height: 40upx;
}
/deep/.mine-layout-wrap {
  background: $jjy-zcwx-bg;
}
.reg-detail-wrap {
  background: $jjy-zcwx-bg;
  height: calc(100vh - 20upx);
  padding: 10upx;
  .reg-detail-content {
    background: #fff;
    .detail {
      color: $jjy-zcwx-gray-2;
      padding-top: 10upx;
      border-top: 1upx solid #cccccc;
      .special-text {
        color: $jjy-zcwx-main;
      }
      view {
        display: flex;
        flex-direction: row;
        .left-label-view {
          display: flex;
          flex-direction: column;
          text-align: right;
          min-width: 215upx;
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
  .reg-reg-content {
    background: #fff;
    margin-top: 20upx;
    .reg-wrap {
      padding: 10upx 0;
      border-top: 1upx solid #cccccc;
      .reg-item {
        display: flex;
        flex-direction: row;
        min-height: 40upx;
        text {
          flex: 1;
          display: block;
          text-align: center;
        }
        view {
          flex: 1;
          display: flex;
          flex-direction: row;
          padding-right: 20upx;
          height: 40upx;
          padding: 10upx 0;
          .special-text {
            color: $jjy-zcwx-main;
            text-align: right;
          }
        }
      }
    }
  }
}
.reg-detail-wrap-null {
  height: calc(100vh - 80px);
}
</style>
