<!--
 * @Descripttion: 待办预算申请单
 * @Author: jsw丶郁
 * @Date: 2022-05-06 15:23:46
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 15:20:40
-->
<template>
  <mine-layout :isShowBtn="false">
    <view class="budget-wrap">
      <!--预算申请的内容 有-->
      <scroll-view
        scroll-y="true"
        @scrolltolower="loadBudget"
        class="budget-content"
        v-if="budgetList.length"
      >
        <view
          class="budget-item"
          v-for="item in budgetList"
          :key="item.billNo"
          @click="goBudgetDetail(item, $event)"
          :data-res="item"
        >
          <!--左侧的申请类型-->
          <view class="budget-left-type jjy-font-size">
            <mine-goods-view :classType="item.classType">
              <text>{{ item.classTypeDescr || "" }}</text>
            </mine-goods-view>
          </view>
          <!--中间的申请内容-->
          <view
            class="budget-center-content jjy-font-size-small"
            :class="item.urgency === '1' ? 'urgency' : ''"
          >
            <view>
              <text class="left-content">单号: {{ item.billNo || "" }}</text>
              <text :class="item.status === '1' ? 'no' : ''">
                {{ item.statusDescr || "" }}
              </text>
            </view>
            <view>
              <text>门店：</text>
              <text class="content-text">
                {{ item.stkId || "" }}-{{ item.stkIdDescr || "" }}
              </text>
            </view>
            <view class="content-text">
              <text>供应商：</text>
              <text>
                {{ item.vendorId || "" }}
              </text>
              <text class="last-text">{{ item.vendorName || "" }}</text>
            </view>
            <view>
              <text>名称：</text>
              <text class="content-text">
                {{ item.className || "" }}
              </text>
            </view>
            <view>
              <text class="amountText">￥{{ item.budgetAmt || 0 }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <!--预算申请的内容 无-->
      <view class="budget-content-null" v-else>
        <text>~暂无待办预算申请单~</text>
      </view>
    </view>
  </mine-layout>
</template>

<script>
import MineGoodsView from "../../components/mineGoodsView/mineGoodsView.vue";
import mineLayout from "../../components/mineLayout/mineLayout.vue";
import MineView from "../../components/mineView/mineView.vue";
import func from "../../mixin/func.vue";
export default {
  components: { mineLayout, MineView, MineGoodsView },
  mixins: [func],
  data() {
    return {
      budgetList: [],
    };
  },
  onShow() {
    // 1. 将数据清空
    this.budgetList = [];
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
     * 跳转到单据详情
     */
    goBudgetDetail(item, event) {
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url: "./detail?type=" + this.type + "&billno=" + dataRes.billNo,
      });
    },
    onPullDownRefresh() {
      // 1. 将数据清空
      this.budgetList = [];
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
      const res = await this.service.budget.getBudgetBills(this.pageInfo, {
        workCondition: "1",
      });
      this.budgetList = [...this.budgetList, ...res.data]; //列表数据赋值

      this.total = res.total; //数据总数赋值
      uni.stopPullDownRefresh(); //数据请求完成 关闭上拉刷新
    },
  },
};
</script>
<style lang="scss" scoped>
.budget-wrap {
  overflow: hidden;
  height: calc(100vh - 20px);
  background-color: $jjy-zcwx-bg;
  padding: 10px 0;
}
.budget-search {
  padding: 24upx;
}
.budget-content,
.budget-content-null {
  height: calc(100vh - 20px);
  width: 750upx;
}
.budget-content-null {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
.budget-content-null text {
  text-align: center;
  color: $jjy-zcwx-gray;
}
.budget-item {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  margin-bottom: 20upx;
}
/** 左侧类型 */
.budget-left-type {
  flex: 1;
}
/**中间内容 */
.budget-center-content {
  flex: 5;
  padding: 20upx;
  view {
    display: flex;
    flex-direction: row;
    .left-content {
      flex: 1;
      max-width: 500upx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content-text {
      max-width: 510upx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tagText {
      color: black;
    }
    .last-text {
      margin-left: 10upx;
      max-width: 340upx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .amountText {
      display: block;
      text-align: right;
      flex: 1;
      margin-top: 20upx;
      color: $jjy-zcwx-main;
    }
  }
}
</style>
