<template>
	<view class="addparts-wrap">
		<view class="item-wrap" 
		v-for="(item,index) in fittList" 
		:key="item.conId"
		>
			<view class="left">
				<checkbox-group @change="changeItem(item,index)">
					<checkbox value="cb" :checked="item.isChecked" />
				</checkbox-group>
			</view>
			<view class="center">
				<view class="center-line">
					<text>
						<text>编码:</text>
						<text>{{item.fittingsId || ''}}</text>
					</text>
					<text class="">
						<text>单位:</text>
						<text>{{item.unit || ''}}</text>
					</text>
					

				</view>
				<view class="center-line">
					<text>名称:</text>
					<text>{{item.fittingsName || ''}}</text>
				</view>
				<view class="center-line">
					<text>合同单价:</text>
					<text>{{item.untaxedAmount || ''}}</text>
				</view>
			</view>
			<view class="right">
				<u-number-box v-model="item.itemqty"></u-number-box>
			</view>
		</view>
		
		<!-- 确认按钮 -->
		<view class="confirmAdd" @click="back">
			确认添加
		</view>
	</view>
</template>

<script>
export default {
	props:{
		list:{
			type:Array,
			default:()=>[]
		}
	},
	data(){
		return {
			fittList:[], // 展示数组
			changeList:[], // 提交数组
		}
	},
	watch:{
		list(val){
			this.fittList = val
		}
	},
	methods:{
		// 状态改变
		changeItem(item,index){
			this.fittList[index].isChecked = !this.fittList[index].isChecked
		},
		// 确定添加
		back(){
			this.changeList = this.fittList.filter(item=>item.isChecked)
			this.$emit('back',this.changeList)
		},
		
	}
}
</script>

<style lang="scss" scoped>
.addparts-wrap{
	.item-wrap{
		// margin:10rpx 0;
		position: relative;
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		border-bottom: solid 1rpx #ccc;
		.center{
			margin-left: 10rpx;
			.center-line{
				margin: 20rpx 0;
			}
		}
		.right{
			padding: 10rpx;
			border-radius: 30rpx;
			width: 200rpx;
			position: absolute;
			right: 10rpx;
			bottom: 20rpx;
			.u-number-box{
				width: 100%;
				height: 100%;
				border: #ccc solid 1px;
			}
		}
	}
}
.confirmAdd{
	background-color: $jjy-zcwx-main;
	height: 40px;
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	line-height: 40px;
	text-align: center;
	border-radius: 20rpx;
	position: fixed;
	bottom: 50rpx;
	left: 20px;
	right: 20px;
}
</style>