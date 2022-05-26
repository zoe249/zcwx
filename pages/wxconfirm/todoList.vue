<!--
 * @Descripttion: 待办维修确认单
 * @Author: jsw丶郁
 * @Date: 2022-05-06 15:39:42
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 15:20:30
-->
<template>
  <view class="confirm-wrap">
    <!--维修确认的内容 有-->
    <scroll-view
      scroll-y="true"
      @scrolltolower="loadBudget"
      class="confirm-content"
      v-if="confirmList.length"
    >
      <view
        class="confirm-item"
        v-for="item in confirmList"
        :key="item.billno"
        @click="goConfirmDetail(item, $event)"
        :data-res="item"
      >
        <!--左侧的申请类型-->
        <view class="confirm-left-type jjy-font-size">
          <mine-goods-view :classType="item.classType">
            <text>{{ item.classTypeDescr || "" }}</text>
          </mine-goods-view>
        </view>
        <!--中间的申请内容-->
        <view
          class="confirm-center-content jjy-font-size-small"
          :class="item.urgency === '1' ? 'urgency' : ''"
        >
          <view jjy-font-size-small>
            <text class="left-content">单号: {{ item.billno || "" }}</text>
            <text :class="item.urgency === '1' ? 'no' : ''">
              {{ item.statusDescr || "" }}
            </text>
          </view>
          <view>
            <text>门店：</text>
            <text class="content-text">
              {{ item.stkid || "" }}-{{ item.stkidDescr || "" }}
            </text>
          </view>
          <view class="content-text">
            <text>供应商：</text>
            <text>
              {{ item.vendorid || "" }}
            </text>
            <text class="last-text">
              {{ item.vendorname || "" }}
            </text>
          </view>
          <view>
            <text>名称：</text>
            <text class="content-text">
              {{ item.className || "" }}
            </text>
          </view>
          <view>
            <text
              :class="item.urgency === '1' ? 'amountTextRed' : 'amountText'"
            >
              ￥{{ item.confirmamt || 0 }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
    <!--维修确认的内容 无-->
    <view class="confirm-content-null" v-else>
      <text>~暂无待办维修确认单~</text>
    </view>
    <float-ball></float-ball>
  </view>
</template>

<script>
import MineView from "../../components/mineView/mineView.vue";
import MineGoodsView from "../../components/mineGoodsView/mineGoodsView.vue";
import func from "../../mixin/func.vue";
export default {
  components: { MineView, MineGoodsView },
  mixins: [func],
  data() {
    return {
      confirmList: [],
    };
  },
  computed: {},
  onShow() {
    // 1. 将数据清空
    this.confirmList = [];
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
    goConfirmDetail(item, event) {
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
      this.confirmList = [];
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
      const res = await this.service.confirm.getConfirmBills(this.pageInfo, {
        workCondition: "1",
      });
      this.confirmList = [...this.confirmList, ...res.data]; //列表数据赋值

      this.total = res.total; //数据总数赋值
      uni.stopPullDownRefresh(); //数据请求完成 关闭上拉刷新
    },
  },
};
</script>
<style lang="scss" scoped>
.confirm-wrap {
  overflow: hidden;
  height: calc(100vh - 20px);
  background-color: $jjy-zcwx-bg;
  padding: 10upx 0;
}
.confirm-search {
  padding: 24upx;
}
.confirm-content,
.confirm-content-null {
  height: calc(100vh - 20px);
  width: 750upx;
}
.confirm-content-null {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
.confirm-content-null text {
  text-align: center;
  color: $jjy-zcwx-gray;
}
.confirm-item {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  margin-bottom: 20upx;
}
/** 左侧类型 */
.confirm-left-type {
  flex: 1;
}
/**中间内容 */
.confirm-center-content {
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

    .amountTextRed {
      display: block;
      text-align: right;
      flex: 1;
      margin-top: 20upx;
      color: $jjy-zcwx-pink;
    }
  }
}
</style>
