<!-- 合同组件 -->
<template>
	<view class="contract-content">
		<scroll-view scroll-y="true" class="scroll">
			<view class="item-wrap"
			v-for="item in contractList" 
			:key="item"
			@click="backAdd(item)"
			>
				<view class="item-line" >
					<view class="item-left">单据号码:</view>
					<view class="item-right">{{item.conId}}</view>
				</view>
				<view class="item-line">
					<view class="item-left">合同名称:</view>
					<view class="item-right">
						{{item.conName}}
					</view>
				</view>
				<view class="item-line">
					<view class="item-left">生效日期:</view>
					<view class="item-right">
						{{item.execdate}}
					</view>
				</view>
				<view class="item-line">
					<view class="item-left">起止日期:</view>
					<view class="item-right">
						{{item.startDt || ""}} 至 {{item.endDt || ""}}
					</view>
				</view>
				<view class="item-status">
					{{item.statusDescr}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	props:{
		contractList:{
			type:Array,
			default:()=>[]
		},
	},
	methods:{
		backAdd(item){
			this.$emit('backAdd',item)
		}
	}
}
</script>

<style lang="scss" scoped>
.scroll{
	height: calc(100vh - 100rpx);
}
.contract-content{
	.item-wrap{
		position:relative;
		margin: 20rpx 0;
		padding:10rpx 0;
		overflow: hidden;
		border-bottom: 1px solid #ccc;
		background-color: #fff;
		.item-line{
			font-size: 30rpx;
			margin:5rpx 0;
			display: flex;
			.item-left{
				margin-right: 10rpx;
				width: 160rpx;
			}
			.item-right{
				// flex: 1;
				width: 500rpx;
				overflow: hidden;
				flex-wrap: nowrap;
			}
		}
		.item-status{
			position: absolute;
			right: 10rpx;
			top: -10rpx;
		}
	}
}
</style>