<!--
 * @Descripttion: 维保等级设备详情
 * @Author: jsw丶郁
 * @Date: 2022-04-06 11:38:28
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-22 15:31:41
-->
<template>
  <view class="acce-wrap jjy-font-size">
    <!-- 配件顶部信息-->
    <view class="acce-top-wrap">
      <view class="table-row">
        <text class="left table-cell">项目编码：</text>
        <text class="right table-cell">{{ acceObj.itemId || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">维保项目：</text>
        <text class="right table-cell">{{ acceObj.mtItem || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">大类：</text>
        <text class="right table-cell">{{
          acceObj.firstClassDescr || ""
        }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">中类：</text>
        <text class="right table-cell">{{
          acceObj.secondClassDescr || ""
        }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">小类：</text>
        <text class="right table-cell">{{
          acceObj.thirdClassDescr || ""
        }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">巡检周期：</text>
        <text class="right table-cell">{{ acceObj.periodIdDescr || "" }} </text>
      </view>
      <view class="table-row">
        <text class="left table-cell">供应商：</text>
        <text class="right table-cell"
          >{{ acceObj.vendorid || "" }} {{ acceObj.vendorname || "" }}</text
        >
      </view>
      <view class="table-row">
        <text class="left table-cell">巡检开始日期：</text>
        <text class="right table-cell">{{ acceObj.periodStart || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">巡检结束日期：</text>
        <text class="right table-cell">{{ acceObj.periodEnd || "" }}</text>
      </view>
    </view>
    <!-- 配件中间内容信息-->
    <view class="acce-centent-wrap">
      <view class="table-row">
        <text class="left table-cell">合同数量：</text>
        <text class="right table-cell">{{ acceObj.quantity || "" }}</text>
        <text class="left table-cell special">维保数量：</text>
		<!-- <text > -->
			<input type="text" v-model="acceObj.itemqty" v-if="isChange">
		<!-- </text> -->
        <text class="right table-cell special" v-else>{{ acceObj.itemqty || "" }}</text>
        <text class="center table-cell special">{{ acceObj.unit || "" }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">合同单价：</text>
        <text class="right table-cell">{{ acceObj.price || "" }}</text>
        <text class="left table-cell special">确认单价：</text>
        <text class="right table-cell special">{{
          acceObj.confirmPrice || ""
        }}</text>
      </view>
      <view class="table-row">
        <text class="left table-cell">合同金额：</text>
        <text class="right table-cell">{{ acceObj.amount || "" }}</text>
        <text class="left table-cell special">最终金额：</text>
        <text class="right table-cell special">{{ acceObj.feeamt || "" }}</text>
      </view>
    </view>
	
	<!-- 确定按钮 -->
	<view class="confirm-btn" @click="confirmBtn">
		确定
	</view>
  </view>
</template>
<script>
import func from '@/mixin/func.vue'
export default {
	mixins:[func],
  data() {
    return {
      acceObj: {},
	  status:'', // 单据状态
    };
  },
  computed:{
	  // 是否可以修改数量
	isChange(){
		let isChange = false
		if(this.status === '0'){
			isChange = true
		}else{
			isChange = false
		}
		return isChange
	} ,
	// 计算总价格
	amount(){
		let amount = Math.ceil(this.acceObj.confirmPrice * this.acceObj.itemqty);
		this.acceObj.feeamt = amount
		return amount
	}
  },
  onLoad(options) {
	  console.log(options)
    const that = this;
	that.status = options.status
    // 获取 eventChannel 事件频道
    const eventChannel = this.getOpenerEventChannel();
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过事件频道 eventChannel 传送到当前页面的数据
    eventChannel.once("getAcce", function (res) {
      that.acceObj = res;
    });
  },
  methods:{
	  // 确认按钮
	  async confirmBtn(){
		  if(this.acceObj.itemqty===''){
			  uni.showToast({
			  	title:'维保数量不能为空',
				icon:'none'
			  })
			  return
		  }
		  const {itemId, itemqty} = this.acceObj
		  console.log(itemId, itemqty)
		  const res = await this.service.reg.registersReg({itemId,itemqty},this.acceObj.billno)
		  console.log(res)
	  }
  }
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
      width: 225upx;
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
  input{
	  border-bottom: 1px solid #ccc;
  }
}
.acce-centent-wrap {
  margin-top: 10upx;
  .table-row {
    .left {
      width: 160;
      text-align: right;
    }
  }
}

// 维保登记修改确定按钮
.confirm-btn{
	position: absolute;
	background-color: $jjy-zcwx-main;
	width: 500rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	bottom: 100rpx;
	color: #fff;
	left: 50%;
	transform: translateX(-50%);
	border-radius: 20rpx;
}
</style>
