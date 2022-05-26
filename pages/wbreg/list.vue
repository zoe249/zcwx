<!--
 * @Descripttion: 维保登记单列表
 * @Author: jsw丶郁
 * @Date: 2022-04-01 15:17:25
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 15:20:07
-->
<template>
  <view class="reg-wrap">
    <!-- 顶部搜索按钮-->
    <view class="reg-search-wrap">
      <simple-search
        @handleSearch="search"
        placeholder="请输入供应商编码或名称"
      ></simple-search>
    </view>
    <scroll-view
      scroll-y="true"
      @scrolltolower="loadBudget"
      class="reg-content-wrap"
    >
      <!-- 中间内容区域 有-->
      <view class="reg-content-has jjy-font-size" v-if="regList.length">
        <view
          class="reg-item"
          v-for="item in regList"
          :key="item.billno"
          @click="goRegDetail(item, $event)"
          :data-res="item"
        >
          <view>
            <text class="left-content">单号：{{ item.billno || "" }}</text>
            <text class="no">{{ item.statusDescr || "" }}</text>
          </view>
          <view>
            <text>门店：</text>
            <text class="content-text">
              {{ item.stkid || "" }}-{{ item.stkidDescr || "" }}
            </text>
          </view>
          <view>
            <text>供应商：</text>
            <text>
              {{ item.vendorid || "" }}
            </text>
            <text class="last-text">
              {{ item.vendorname || "" }}
            </text>
          </view>
          <view>
            <text class="left">创建日期：{{ item.createtime || "" }}</text>
            <text class="right special">维保金额：￥{{ item.mtamt || 0 }}</text>
          </view>
        </view>
      </view>
      <!--中间内容区域无-->
      <view class="reg-content-no" v-else>
        <text>~暂无维保登记单~</text>
      </view>
    </scroll-view>

    <float-ball></float-ball>
	
	<view class="add-reg" @click="addReg">
		新增维保
	</view>
  </view>
</template>

<script>
import SimpleSearch from "../../components/simpleSearch/simpleSearch.vue";
import func from "../../mixin/func.vue";
export default {
  data() {
    return {
      regList: [],
    };
  },
  components: {
    SimpleSearch,
  },
  mixins: [func],
  onShow() {
    // 1. 将数据清空
    this.regList = [];
    this.total = 0;
    this.pageInfo = {
      pageIndex: 1, //当前页
      pageSize: 10, //分页大小
    };
    // 2. 获取数据
    this.getBillLists();
  },
  methods: {
    /**
     * 顶部搜索按钮
     */
    search(value) {
      this.searchVal = value;
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
      };
      // 1. 将数据清空
      this.regList = [];
      this.total = 0;
      // 2. 获取数据
      this.getBillLists();
    },
    /**
     * 跳转到单据详情
     */
    goRegDetail(item, event) {
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url: "./detail?type=" + this.type + "&billno=" + dataRes.billno,
      });
    },
    onPullDownRefresh() {
      // 1. 将数据清空
      this.regList = [];
      this.total = 0;
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
      };
      // 2. 获取数据
      this.getBillLists();
    },
    // 上滑加载 加载下一页数据
    loadBudget() {
      const { pageIndex, pageSize } = this.pageInfo;
      // 1. 判断剩余分页数 total / pageSize 向上取整 Math.ceil();
      const pageNum = Math.ceil(this.total / pageSize);
      // 2. 判断当前分页是否是最后一个
      if (pageIndex >= pageNum) {
        uni.showToast({
          title: "暂无最新数据",
          icon: "none",
        });
        return;
      }
      // 3. 当前分页数加1
      this.pageInfo.pageIndex++;
      // 4. 获取数据
      this.getBillLists();
    },
    /**
     * 获取预算申请单列表信息
     */
    async getBillLists() {
      // 获取微信申请单列表
      const res = await this.service.reg.getRegBills(this.pageInfo, {
        vendorId: this.searchVal,
      });
      this.regList = [...this.regList, ...res.data]; //列表数据赋值

      this.total = res.total; //数据总数赋值
      uni.stopPullDownRefresh(); //数据请求完成 关闭上拉刷新
    },
	
	// 新增维保
	addReg(){
		uni.navigateTo({
			url:'./add?type='+this.type
		})
	}
  },
};
</script>

<style scoped lang="scss">
.reg-wrap {
  background: $jjy-zcwx-bg;
  height: calc(100vh - 20upx);
  .reg-search-wrap {
    padding: 24upx;
  }
  .reg-content-wrap {
    height: calc(100vh - 70px);
    width: 100%;
    margin-top: 10upx;
    .reg-content-has {
      .reg-item {
        margin-bottom: 10upx;
        background: #fff;
        padding: 10upx;
        width: 750upx;
        view {
          display: flex;
          flex-direction: row;
          width: 730upx;
          text {
            display: block;
            margin-bottom: 10upx;
          }
          .left-content {
            flex: 1;
            max-width: 600upx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .content-text {
            max-width: 610upx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .last-text {
            margin-left: 10upx;
            max-width: 450upx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .left,
          .right {
            margin-top: 20upx;
            color: $jjy-zcwx-gray;
            font-size: 25upx;
            font-weight: 400;
            flex: 1;
          }
          .special {
            color: $jjy-zcwx-main;
            text-align: right;
          }
        }
      }
    }
    .reg-content-no {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      height: calc(100vh - 55px);
      text {
        color: $jjy-zcwx-gray;
      }
    }
  }
}
.add-reg{
	position: fixed;
	background-color: $jjy-zcwx-main;
	bottom: 100rpx;
	width: 500rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color: #fff;
	left: 50%;
	transform: translateX(-50%);
	border-radius: 15rpx;
	
}
</style>
