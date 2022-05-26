<!--
 * @Descripttion: 选择商品
 * @Author: jsw丶郁
 * @Date: 2022-04-01 15:44:21
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-05 17:03:56
-->
<template>
  <view class="multi-goods-wrap jjy-font-size">
    <!--顶部查询组件-->
    <view class="multi-good-search-wrap">
      <search-input
        @handlerImg="handlerSearch"
        searchType="scan"
        searchIcon="scan"
      ></search-input>
    </view>
    <scroll-view
      scroll-y="true"
      @scrolltolower="loadApply"
      class="multi-good-content-wrap"
    >
      <view
        class="good-item-content"
        v-for="item in goodList"
        :key="item.billno"
        :data-res="item"
        @click="goSingleGood(item, $event)"
      >
        <!--左侧类型界面-->
        <view class="left-content">
          <mine-goods-view :classType="item.classType">
            <text>{{ item.classTypeDescr || "" }}</text>
          </mine-goods-view>
        </view>
        <!-- 右侧内容界面-->
        <view class="right-content">
          <view class="right-top-content">
            <text>名称：{{ item.name || "" }}</text>
          </view>
          <view class="right-bottom-content">
            <text>类别：{{ item.classTypeName || "" }}</text>
            <text>编码：{{ item.code || "" }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <float-ball></float-ball>
  </view>
</template>
<script>
import MineGoodsView from "../../components/mineGoodsView/mineGoodsView.vue";
import searchInput from "../../components/searchInput/searchInput.vue";
import func from "../../mixin/func.vue";
export default {
  components: { searchInput, MineGoodsView },
  mixins: [func],
  data() {
    return {
      goodList: [],
    };
  },
  onShow() {
    const _tempMultiGoods = uni.getStorageSync("_tempMultiGoods");
    if (_tempMultiGoods) {
      const { data, total, searchVal } = _tempMultiGoods;
      this.searchVal = searchVal;
      this.total = total;
      this.goodList = data;
    }
  },
  methods: {
    async handlerSearch(val) {
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 20,
      };
      const res = await this.service.base.getClass(this.pageInfo, val);
      const { data, total } = res;
      switch (data.length) {
        case 0: //没有查询出数据
          uni.showToast({
            title: "查询数据为空",
            icon: "error",
            duration: 1500,
          });
          break;
        case 1: // 查询出单个商品的数据
          uni.removeStorageSync("_tempMultiGoods");
          uni.navigateTo({
            url: "./singleGood?type=" + this.type,
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit("getGoods", data[0]);
            },
          });
          break;
        default: // 查询出多个商品的数据
          this.total = total;
          this.goodList = data;
          uni.setStorageSync("_tempMultiGoods", {
            data,
            total,
            searchVal: val,
          });
          break;
      }
    },
    // 上滑加载 加载下一页数据
    loadApply() {
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
     * 获取维修申请单列表信息
     */
    async getBillLists() {
      // 获取微信申请单列表
      const res = await this.service.base.getClass(
        this.pageInfo,
        this.searchVal
      );
      this.goodList = [...this.goodList, ...res.data]; //列表数据赋值
      this.total = res.total; //数据总数赋值
    },
    /**
     *点击跳转到单个商品列表
     */
    goSingleGood(item, event) {
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url: "./singleGood?type=" + this.type,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("getGoods", dataRes);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.multi-goods-wrap {
  overflow: hidden;
  height: 100vh;
  background-color: #f4f4f4;
}
/**查询组件 */
.multi-good-search-wrap {
  margin: 10upx;
  background: #fff;
}
/**中间内容区域 */
.multi-good-content-wrap {
  height: calc(100vh - 100upx);
  width: 750upx;
  padding-top: 10upx;
}
.good-item-content {
  display: flex;
  flex-direction: row;
  background: #fff;
  margin-bottom: 20upx;
  font-size: 25upx;
  .left-content {
    flex: 1;
  }
  .right-content {
    flex: 6;
    padding: 10upx;
    color: #333333;
    max-width: 600upx;
    .right-top-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .right-bottom-content {
      display: flex;
      flex-direction: row;
      margin-top: 10upx;
      color: #999999;
      text {
        flex: 1;
      }
    }
  }
}
</style>
