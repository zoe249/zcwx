<template>
	<view class="addparts-wrap">
		<simple-search/>
		
		<!-- 内容 -->
		<mine-parts/>
		
		<!-- 确认按钮 -->
		<view class="confirmAdd" @click="back">
			确认添加
		</view>
	</view>
</template>

<script>
import mineLayout from '@/components/mineLayout/mineLayout.vue'
import simpleSearch from '@/components/simpleSearch/simpleSearch.vue'
import mineParts from '@/components/mineParts/mineParts.vue'
export default {
	components:{mineLayout,simpleSearch,mineParts},
	data(){
		return {
			partBtnList:[
				{
				  name: "提交申请",
				  type: "ok",
				  background: "#70A4F8",
				},
			]
		}
	},
	methods:{
		// 返回上一个页面
		back(item){
			let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			prevPage.$vm.otherFun(item)	// 給上一頁綁定方法otherFun,傳參object
			uni.navigateBack({
			    delta:1 // 可以不傳delta值，默認為1
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.addparts-wrap{
	padding: 20rpx;
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