<!--
 * @Descripttion: 维修确认单详情界面
 * @Author: jsw丶郁
 * @Date: 2022-04-02 17:02:18
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-11 10:40:07
-->
<template>
  <mine-layout
    :btnList="btnList"
    @handleBtn="submitconfirm"
    :isShowBtn="isShowBtn"
    v-if="isSuccess"
  >
    <view
      class="confirm-detail-wrap jjy-font-size"
      :class="{ 'confirm-detail-wrap-null': isShowBtn }"
    >
      <mine-steps :stepObj="stepObj" :billType="type"></mine-steps>
      <!--顶部信息-->
      <view class="confirm-detail-content">
        <mine-collapse title="单据信息" :showIcon="false">
          <!--标题-->
          <view
            slot="right"
            @click.stop="goRate"
            v-if="confirmObj.canSelectScore"
          >
            <u-button color="#70A4F8" text="评价"></u-button
          ></view>
          <!--详情信息-->
          <view class="detail">
            <view>
              <text class="left-label-view">单号：</text>
              <view class="center-value-view">
                <view class="row-filed-view">
                  <text>{{ confirmObj.billno || "" }}</text>
                  <text class="no">{{ confirmObj.statusDescr || "" }}</text>
                </view>
              </view>
            </view>
            <!-- <view>
              <text class="left-label-view">签单单号：</text>
              <view class="center-value-view">
                <text>{{ confirmObj.signno || "" }}</text>
              </view>
            </view> -->
            <view>
              <text class="left-label-view">生效日期：</text>
              <view class="center-value-view">
                <text>{{ confirmObj.execdate || "" }}</text>
              </view>
            </view>
            <!-- <view>
              <text class="left-label-view">签单日期：</text>
              <view class="center-value-view">
                <text>{{ confirmObj.signdate || "" }}</text>
              </view>
            </view> -->
            <view>
              <text class="left-label-view">门店编码：</text>
              <view class="center-value-view">
                <text>
                  {{ confirmObj.stkid || "" }}-{{ confirmObj.stkidDescr || "" }}
                </text>
              </view>
            </view>
            <view>
              <text class="left-label-view">门店地址：</text>
              <view class="center-value-view">
                <text>{{ confirmObj.shopaddr || "" }}</text>
              </view>
            </view>
            <view>
              <text class="left-label-view">供应商：</text>
              <view class="center-value-view">
                {{ confirmObj.vendorid || "" }}
                {{ confirmObj.vendorname || "" }}
              </view>
            </view>
            <view>
              <text class="left-label-view">供应商联系人：</text>
              <mine-contact
                class="center-value-view"
                :consignee="confirmObj.connecter || ''"
                :phone="confirmObj.vendortel || ''"
              ></mine-contact>
            </view>
            <view>
              <text class="left-label-view">维修联系人：</text>
              <mine-contact
                class="center-value-view"
                :consignee="confirmObj.repairName || ''"
                :phone="confirmObj.repairTel || ''"
              ></mine-contact>
            </view>
			<!-- 新增 -->
			<view class="submit-view">
				<view>
					<text class="left-label-view">预算金额：</text>
					<view class="center-value-view">
					  <input type="text" v-model="submitConfirm.billNo" placeholder="请输入签单单号">
					</view>
				</view>
				<view>
					<text class="left-label-view">签单日期：</text>
					<view class="center-value-view">
					  <input type="text" v-model="submitConfirm.signingData" placeholder="选择签单日期">
					</view>
				</view>
				<view>
					<text class="left-label-view">合同编号：</text>
					<view class="center-value-view" @click="toContract">
					  <input type="text" v-model="submitConfirm.conld" placeholder="选择合同编号" disabled="true">
					</view>
				</view>
			</view>
            <view class="bottom-view">
              <view>
                <text class="left-label-view">预算金额：</text>
                <view class="center-value-view">
                  <text>{{ confirmObj.budgetamt || "" }}</text>
                  <!-- <text class="special-text">
                    路费：{{ confirmObj.stkfeeamt || "" }}
                  </text> -->
				  <view class="special-text" id="special-input">
					  <view>路费：</view>
				    <input type="text" v-model="submitConfirm.toll" />
				  </view>
                </view>
              </view>

              <view>
                <text class="left-label-view">维修金额：</text>
                <view class="center-value-view">
                  <text>{{ confirmObj.extcol1 || "" }}</text>
                  <text class="special-text">
                    确认金额：{{ confirmObj.confirmamt || "" }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </mine-collapse>
      </view>
      <!--设备信息-->
      <view class="confirm-equi-content">
        <mine-collapse title="设备信息" :showIcon="false">
          <!--抢单的表单控件-->
          <view class="equi-form-wrap">
            <view>
              <text>编码：</text>
              <text>
                {{ confirmObj.classType || "" }}
              </text>
            </view>
            <view>
              <text class="left-label-view">名称：</text>
              <text class="right-input-view">
                {{ confirmObj.classTypeDescr || "" }}
              </text>
            </view>
            <view>
              <text>故障描述：</text>
              <text>
                {{ confirmObj.remark || "" }}
              </text>
            </view>
          </view>
        </mine-collapse>
      </view>
      <!--配件信息-->
      <view
        class="confirm-acce-content"
        v-if="confirmObj.confirmFList && confirmObj.confirmFList.length"
      >
        <mine-collapse title="配件信息" :showIcon="false">
          <!--确认的配件控件-->
          <view class="acce-wrap">
            <view
              class="acce-item"
              v-for="item in confirmObj.confirmFList"
              :key="item.fittingsId"
              for="acce"
            >
              <text>{{ item.fittingsId || "" }}</text>
              <text>{{ item.fittingsName || "" }}</text>
              <view @click="goAcce(item, $event)" :data-res="item">
                <text class="special-text">￥{{ item.confirmamt || 0 }} </text>
                <u-icon name="arrow-right" color="#999" size="20px"> </u-icon>
              </view>
            </view>
			<!-- 添加配件 -->
			<view class="add-button" @click="handlerAdd">
				添加配件
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
import MineSteps from "../../components/mineSteps/mineSteps.vue";
import func from "../../mixin/func.vue";
export default {
  mixins: [func],
  data() {
    return {
      confirmObj: {},
      isSuccess: false,
      isShowBtn: false,
      stepObj: {},
	  submitConfirm:{ // 维修确认单修改
		  billNo:"", // 签单单号
		  signingData:"", // 签单日期
		  conld:"", // 合同编号,
		  toll:0, // 路费
		  confirmamt:0, // 确认金额
	  },
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
  computed:{
	  // 按钮
	  btnList(){
		  let btnList = []
		  if(this.confirmObj.status === "9"){
			  btnList = [
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
			  ]
		  }else if(this.confirmObj.status === "0"){
			  btnList = [
				  {
					name: "仅保存",
					type: "no",
					background: "#aaaaff",
					isDisabled: false,
				  },
				  {
					name: "保存并审批",
					type: "yes",
					background: "#70A4F8",
					isDisabled: false,
				  },
			]
		  }
		  return btnList
	  }
  },
  onLoad: function (option) {
    const { billno } = option;
    this.goConfirmDetail(billno);
  },
  methods: {
    goAcce(item, event) {
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url: "./acce",
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
          res.eventChannel.emit("getBill", that.confirmObj);
        },
      });
    },
    async goConfirmDetail(billno) {
      const res = await this.service.confirm.getConfirmBillByBillNo(billno);
      this.confirmObj = res.data;
      if (res.data.status === "9") {
        const isChkright = await this.service.confirm.checkApproveConfirm(
          billno
        )
        this.isShowBtn = this.rightObj.chkright && isChkright.data;
      }else if(res.data.status === "0"){
		  // 草稿状态
		  this.isShowBtn = this.rightObj.chkright;
	  }
      await this.getFlowProgress(billno);
      this.isSuccess = true;
    },
    async submitconfirm(type) {
      const billno = this.confirmObj.billno;
      let isSuccess = false;
      switch (type) {
        case "yes":
          await this.service.confirm.approveConfirm(billno, "1");
          uni.showToast({
            title: "审核成功",
            icon: "none",
            duration: 2500,
            mask: true,
          });
          isSuccess = true;
          break;
        case "no":
          await this.service.confirm.approveConfirm(billno, "2");
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
    async getFlowProgress(billno) {
      const { permissionList } = this.userInfo;
      const billCode = permissionList.filter(
        (item) => item.funcno === this.type
      )[0].billCode;
      const res = await this.service.base.getFlowProgress(billCode, billno);
      this.stepObj = res;
    },
	// 选择合同
	toContract(){
		uni.navigateTo({
			url:'./contract'
		})
	},
	// 接受参数
	otherFun(object){
		const _this = this
		if(object){
			console.log(object)	
		}else{
			return
		}
	},
	// 添加配件
	handlerAdd(){
		uni.navigateTo({
			url:'./addParts',
			success:(res)=>{
				console.log(res)
			}
		})
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
.confirm-detail-wrap {
  background: $jjy-zcwx-bg;
  height: calc(100vh - 20upx);
  padding: 10upx;
  overflow: auto;
  .confirm-detail-content {
    background: #fff;
    .detail {
      color: $jjy-zcwx-gray-2;
      border-top: 1upx solid #cccccc;
      padding-top: 10upx;
      view {
        display: flex;
        flex-direction: row;
        .left-label-view {
          display: flex;
          flex-direction: column;
          text-align: right;
          min-width: 230upx;
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
      .bottom-view {
        color: $jjy-zcwx-gray-2;
        text-align: right;
        margin-top: 20upx;
        padding-bottom: 40upx;
        display: flex;
        flex-direction: column;
        view {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .left-label-view {
            display: flex;
            flex-direction: column;
            text-align: right;
            width: 200upx;
          }
          .center-value-view {
            flex: 1;
            color: $jjy-zcwx-gray-2;
            text-align: right;
            text:first-child {
              flex: 1;
              text-align: left;
            }
            text:last-child {
              flex: 2;
              text-align: left;
            }
          }
        }
      }
    }
  }
  .confirm-equi-content {
    background: #fff;
    margin-top: 20upx;
    .equi-form-wrap {
      color: $jjy-zcwx-gray-2;
      border-top: 1upx solid #cccccc;
      padding-bottom: 10upx;
      view {
        display: flex;
        flex-direction: row;
        margin-top: 10upx;
        text:first-child {
          text-align: right;
          width: 160upx;
        }
      }
    }
  }
  .confirm-acce-content {
    background: #fff;
    margin-top: 20upx;
    .acce-wrap {
      padding: 10upx 0;
      border-top: 1upx solid #cccccc;
	  position: relative;
	  // 添加配件按钮
	  .add-button{
	  	background-color: $jjy-zcwx-main;
	  	color: #fff;
	  	padding: 15rpx 20rpx;
	  	border-radius: 15rpx;
	  	position: absolute;
	  	bottom: -100rpx;
	  	right: 20rpx;
	  }
      .acce-item {
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
          height: 40upx;
          padding-right: 20upx;
          padding: 10upx 0;
          .special-text {
            color: $jjy-zcwx-main;
            text-align: right;
            height: 40upx;
            line-height: 40upx;
            display: block;
          }
        }
      }
    }
  }
}
.confirm-detail-wrap-null {
  height: calc(100vh - 80px);
}


// 新增表单
.submit-view{
	margin-top: 20rpx;
	display: block !important;
	view{
		margin: 5rpx 0;
		display: flex;
		align-items: center;
	}
	input{
		font-size: 28rpx;
		border: 1px solid #ccc;
		padding: 0 50rpx 0 10rpx;
		border-radius: 30rpx;
	}
	.left-label-view{
		position: relative;
		&:before{
			position: absolute;
			content: "*";
			color: red;
			left: 55rpx;
		}
	}
}
#special-input{
	display: flex;
	flex-direction: row;
	view{
		width: 100rpx;
		margin-left: 100rpx;
	}
	input{
		flex:1;
		// margin-left: 20rpx;
		text-align: left;
		border-bottom: 1px solid #ccc;
		padding:  0 10rpx;
		// border-radius: 30rpx;
	}
}



</style>
