<template>
	<view class="addparts-wrap">
		<simple-search/>
		
		<!-- 内容 -->
		<mine-parts 
		:list="fittingList"
		@back='back'
		/>
		
		
	</view>
</template>

<script>
import mineLayout from '@/components/mineLayout/mineLayout.vue'
import simpleSearch from '@/components/simpleSearch/simpleSearch.vue'
import mineParts from '@/components/mineParts/mineParts.vue'
import func from '@/mixin/func.vue'
export default {
	mixins:[func],
	components:{mineLayout,simpleSearch,mineParts},
	data(){
		return {
			partBtnList:[
				{
				  name: "提交申请",
				  type: "ok",
				  background: "#70A4F8",
				},
			],
			conId:'',	// 合同单据
			searchVal:'', // 搜索关键字
			fittingList:[], // 配件列表
		}
	},
	onLoad(options) {
		if(options.conId){
			this.conId = options.conId
		}
		this.getFitting()
	},
	methods:{
		// 返回上一个页面
		back(list){
			// console.log(list)
			let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			prevPage.$vm.otherFun(list,'1')	// 給上一頁綁定方法otherFun,傳參object
			uni.navigateBack({
			    delta:1 // 可以不傳delta值，默認為1
			})
		},
		// 获取配件列表
		async getFitting(){
			const res = await this.service.base.getFittingList(this.pageInfo,this.conId,this.searchVal)
			this.total = res.total
			this.fittingList = res.data.map(item=>{
				// 默认全选
				item.isChecked = true
				item.itemqty = 1
				return item
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.addparts-wrap{
	padding: 20rpx;
}


</style>