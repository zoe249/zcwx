<template>
	<mine-layout 
		:isShowBtn="true"
		:btnList="addBtnList"
		@handleBtn="handleBtn"
	>
		<mine-collapse class="add-wbreg-content">
			<view class="item-wrap">
				<view class="left-label-view">门店：</view>
				<view class="right-label-view">
					<input type="text" v-model="storeInfo.name" placeholder="选择门店" disabled="true">
					<view class="contract-store" @click="isStore = !isStore">
						<u-icon name="arrow-down" color="#999" size="20px" v-if="isStore"> </u-icon>
						<u-icon name="arrow-up" color="#999" size="20px" v-else> </u-icon>
					</view>
				</view>
			</view>
			<view class="item-wrap">
				<view class="left-label-view">门店地址：</view>
				<view class="right-label-view">
					<input type="text" v-model="storeInfo.address" placeholder="选择门店" disabled="true">
				</view>
			</view>
			<view class="item-wrap">
				<view class="left-label-view">供应商：</view>
				<view class="right-label-view">
					<input @blur="getVender" type="text" v-model="addConObj.vendorid" placeholder="选择供应商" :disabled="!isDisabled">   
				</view>
			</view>
			<view class="item-wrap contract">
				<view class="left-label-view">合同编号：</view>
				<view class="right-label-view" @click="toContract">
					<input type="text" v-model="addConObj.conId" placeholder="选择合同编号" disabled="true">
					<view class="contract-search">
						<u-icon name="search" size="24px"></u-icon>
					</view>
				</view>
			</view>
			<view class="item-wrap">
				<view class="left-label-view">维修人员姓名：</view>
				<view class="right-label-view">
					<input type="text" v-model="addConObj.repairname" placeholder="填写维修人员姓名">
				</view>
			</view>
			<view class="item-wrap">
				<view class="left-label-view">维修人员手机：</view>
				<view class="right-label-view">
					<input type="text" v-model="addConObj.repairtel" placeholder="填写维修人员手机号">
				</view>
			</view>
			<view class="item-wrap">
				<view class="left-label-view">维保日期：</view>
				<view class="right-label-view">
					<input type="text" v-model="addConObj.mtDate" placeholder="选择上门时间" disabled>
					<view class="contract-date">
						<u-icon name="order" @click="pickerTime = true" size="28px">
						</u-icon>
					</view>
				</view>
			</view>
		</mine-collapse>
		
		<!-- 配件信息 -->
		<mine-collapse>
			<view class="reg-wbreg-content">
				<view class="item-wrap" v-for="item in fittList" :key="item">
					<text>{{ item.fittingsId || "id" }}</text>
					<text>{{ item.fittingsName || "id" }}</text>
					<view @click="goAcce()">
					  <text class="special-text">￥{{ item.referencePrice || 0 }} </text>
					  <u-icon name="arrow-right" color="#999" size="20px"> </u-icon>
					</view>
				</view>
				
				<view class="add-button" @click="handlerAdd">
					添加配件
				</view>
				
				<!-- 选择门店 -->
				<view class="store-wrap" v-if="isStore">
					<scroll-view scroll-y="true">
						<view class="store-item" 
						v-for="(item,index) in storeList" 
						:key="item.acctid" 
						:class="{activeStore:index === currentIndex}"
						@click="storeClick(item,index)">
							<text>{{item.nameStk}}</text>
						</view>
					</scroll-view>
				</view>
				
				<!-- 日期选择 -->
				<view class="picker">
					<u-datetime-picker
						:show="pickerTime"
						v-model="time"
						mode="datetime"
						@confirm="confirm"
						@cancel="closeDateTime"
					></u-datetime-picker>
				</view>
			</view>
		</mine-collapse>
		
		
	</mine-layout>
</template>

<script>
import mineLayout from '@/components/mineLayout/mineLayout.vue'
import mineCollapse from '@/components/mineCollapse/mineCollapse.vue'
import func from '@/mixin/func.vue'
export default {
	mixins:[func],
	components:{mineLayout, mineCollapse},
	data(){
		return {
			addBtnList: [
			  {
			    name: "仅保存",
			    type: "add",
			    background: "#aaaaff",
			    isDisabled: false,
			  },
			  {
			    name: "保存并审批",
			    type: "approve",
			    background: "#70A4F8",
			    isDisabled: false,
			  },
			],
			vendorId:'02708794',// 供应商id
			addConObj:{  // 提交
				stkid:'',	// 门店编码
				vendorid:'02708794',	// 供应商编码
				conId:'',	// 合同编号
				repairname:'',	// 维保人员姓名
				repairtel:'',	// 维保人员电话
				mtDate:'',	// 维保时间
				sign:'',	//add仅保存，approve保存并审批
				registerDs:[], // 单据明细
			},
			// vendorName:'', // 供应商信息
			pickerTime:false, // 是否显示时间组件
			time: new Date(), // 时间
			isDisabled:true, // 输入框是否可用
			storeList:[], // 门店列表
			isStore:false, // 显示门店列表
			currentIndex:0, // 当前选中的门店
			storeInfo:{ // 门店信息
				name:'',
				address:''
			},
			fittList:[], // 配件列表
		}
	},
	onLoad() {
		this.getStore()
	},
	onShow() {
		const userInfo = this.userInfo
		if(userInfo.usertype === '1'){
			// 供应商账号，不可修改名称
			this.isDisabled = false
			this.addConObj.vendorid = userInfo.userid+'-'+userInfo.username
		}else{
			// 获取供应商
			// this.getVender()
		}
	},
	methods:{
		// 获取门店信息
		async getStore(){
			const res = await this.service.store.getStore({pageSize:10,pageIndex:1},'','m_mt_reg')
			this.total = res.total
			this.storeList = res.data
			// console.log(res.data)
		},
		goAcce(){
			console.log('跳转到详情')
		},
		// 添加配件
		handlerAdd(){
			const conId = this.addConObj.conId
			if(conId === ''){
				uni.showToast({
					title:'请先选择合同编码',
					icon:'none'
				})
				return
			}
			uni.navigateTo({
				url:'./addParts?conId='+conId,
				success:(res)=>{
					console.log(res)
				}
			})
		},
		// 合同列表
		toContract(){
			uni.navigateTo({
				url:'./contract?vendorId='+this.vendorId,
				success:(res)=>{
					console.log(res)
				}
			})
		},
		// 接受参数
		otherFun(object,type) {
			const _this = this
			if(object){
				if(type === '0'){
					_this.addConObj.conId = object.conId
				}else{
					_this.fittList = object
					const list = []
					_this.fittList.forEach(item=>{
						let obj = {}
						obj.itemId = item.fittingsId
						obj.itemqty = item.itemqty
						list.push(obj)
					})
					this.addConObj.registerDs = list
				}
				
			}else{
				return
			}
		},
		// 保存或审批
		async handleBtn(type){
			// 1.处理
			const data = this.addConObj
			data.vendorid = data.vendorid.split('-')[0]
			data.sign = type
			// console.log(data)
			// 2.效验表单
			if(data.stkid === ''){
				uni.showToast({
					title:'门店编码不可为空',
					icon: "none",
				})
				return
			}
			if(data.vendorid === ''){
				uni.showToast({
					title:'供应商不可为空',
					icon: "none",
				})
				return
			}
			if(data.conId === ''){
				uni.showToast({
					title:'合同编号不可为空',
					icon: "none",
				})
				return
			}
			if(data.repairname === ''){
				uni.showToast({
					title:'维保人员不可为空',
					icon: "none",
				})
				return
			}
			if(data.repairtel === ''){
				uni.showToast({
					title:'电话不可为空',
					icon: "none",
				})
				return
			}
			if(data.mtDate === ''){
				uni.showToast({
					title:'维保时间不可为空',
					icon: "none",
				})
				return
			}
			
			// 3.提交表单
			const res = await this.service.reg.addRegistersReg(data)
			console.log(res)
		},
		// 查询供应商
		async getVender(){
			if(this.addConObj.vendorid === ''){
				uni.showToast({
					title:'供应商id不可为空',
					icon:'none'
				})
				return 
			}
			if(this.userType === '1'){
				return
			}
			const res = await this.service.base.getVender(this.addConObj.vendorid);
			this.vendorId = res.data.vendorid
			this.addConObj.vendorid = res.data.vendorid + '-' + res.data.vendorDescr
		},
		// 选择门店
		storeClick(item,index){
			console.log(item,index)
			const obj = this.storeList[index]
			// 1.更新视图
			this.storeInfo.name = obj.notes + obj.nameStk
			this.storeInfo.address = obj.shopaddr
			this.currentIndex = index
			this.isStore = false
			// 2.更新表单
			this.addConObj.stkid = obj.stkid
		},
		// 日期组件
		confirm(e) {
		  const timeFormat = uni.$u.timeFormat;
		  // console.log(timeFormat(new Date(e.value), "yyyy-mm-dd hh:MM"));
		  this.addConObj.mtDate = timeFormat(
		    new Date(e.value),
		    "yyyy-mm-dd hh:MM"
		  );
		  this.pickerTime = false;
		},
		closeDateTime() {
		  this.pickerTime = false;
		},
	}
}
</script>

<style lang="scss" scoped>
.add-wbreg-content{
	.item-wrap{
		font-size: 30rpx;
		display: flex;
		font-weight: 300;
		padding: 0 20rpx;
		align-items: center;
		.left-label-view{
			margin: 10rpx 0;
			width: 225rpx;
			text-align: right;
			
		}
		.right-label-view{
			position: relative;
			flex: 1;
			input{
				font-size: 26rpx;
				border:solid 1px #ccc ;
				padding: 0 40rpx 0 10rpx;
			}
			// 门店
			.contract-store{
				position: absolute;
				right: 5rpx;
				top: 5rpx;
			}
			// 时间
			.contract-date{
				position: absolute;
				right: 0;
				top: -5rpx;
			}
		}
	}
	// 搜索合同
	.contract{
		position: relative;
		.contract-search{
			position: absolute;
			right: 0rpx;
			top: 0rpx;
		}
	}
}

.reg-wbreg-content{
	 border-top: 1upx solid #cccccc;
	padding: 0 20rpx;
	height: 100%;
	position: relative;
	.item-wrap{
		
		display: flex;
		justify-content: space-between;
		view{
			display: flex;
		}
	}
	.add-button{
		background-color: $jjy-zcwx-main;
		color: #fff;
		padding: 15rpx 20rpx;
		border-radius: 15rpx;
		position: absolute;
		bottom: -100rpx;
		right: 20rpx;
	}
	.picker{
		position: absolute;
		height: 300rpx;
	}
}



.collapse-content-wrap{
	margin: auto;
}
// 门店选择
.store-wrap{
	width: 457rpx;
	height: 300rpx;
	background-color: #fff;
	position: fixed;
	top: 117rpx;
	right: 50rpx;
	z-index: 99;
	overflow: hidden;
	scroll-view{
		height: 300rpx;
		.store-item{
			height: 60rpx;
			padding: 0 20rpx;
			line-height: 60rpx;
			border-bottom:1px solid #ccc;
		}
		.activeStore{
			background-color: #ccc;
		}
	}
}
// 时间选择
/deep/picker-view {
  width: 100%;
  height: 600upx;
}
</style>