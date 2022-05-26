<template>
	<view class="wbreg-contract">
		<simple-search></simple-search>
		<mine-contract @backAdd="backAdd" :contractList="contractList"/>
	</view>
</template>

<script>
import simpleSearch from '@/components/simpleSearch/simpleSearch.vue'
import mineContract from '@/components/mineContract/mineContract.vue'
import func from '@/mixin/func.vue'
export default{
	mixins:[func],
	components:{simpleSearch,mineContract},
	data(){
		return{
			contractList:[], // 合同列表
			vendorid:'' // 供应商id
		}
	},
	onLoad(options) {
		options.vendorId ? this.vendorid = options.vendorId : ''
		this.getContractList()
	},
	methods:{
		// 返回上一个页面
		backAdd(item,){
			let pages = getCurrentPages(); // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			prevPage.$vm.otherFun(item,'0')	// 給上一頁綁定方法otherFun,傳參object
			uni.navigateBack({
			    delta:1 // 可以不傳delta值，默認為1
			})

		},
		// 获取合同列表
		async getContractList(){
			const res = await this.service.base.getContractList({
				pageSize:10,
				pageIndex:1
			},this.vendorid,'m_mt_reg')
			this.total = res.total
			this.contractList = res.data
		}
	}
}
</script>

<style lang="scss">
.wbreg-contract{
	padding: 20rpx;
}

</style>