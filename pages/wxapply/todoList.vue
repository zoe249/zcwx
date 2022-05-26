<!--
 * @Descripttion: 待办维修申请列表
 * @Author: jsw丶郁
 * @Date: 2022-05-06 14:07:40
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 15:19:07
-->
<template>
  <mine-layout :isShowBtn="false">
    <view class="apply-wrap">
      <!--内部员工才存在选择器 userType==='0'-->
      <u-subsection
        :list="list"
        :current="curNow"
        @change="sectionChange"
        v-if="userType == 0"
      ></u-subsection>
      <!--申请列表的内容 有-->
      <scroll-view
        scroll-y="true"
        @scrolltolower="loadApply"
        v-if="applyList.length"
        :class="{
          'user-type-content': userType != 0,
          'apply-wrap-content': userType == 0,
        }"
      >
        <view
          class="apply-item"
          v-for="item in applyList"
          :key="item.billno"
          :data-res="item"
          @click="goApplyDetail(item, $event)"
        >
          <!--左侧的申请类型-->
          <view class="apply-left-type jjy-font-size">
            <mine-goods-view :classType="item.classType">
              <text>{{ item.classTypeDescr || "" }}</text>
            </mine-goods-view>
          </view>
          <!--中间的申请内容-->
          <view
            class="apply-center-content jjy-font-size-small"
            :class="item.urgency === '1' ? 'urgency' : ''"
          >
            <view class="flex-row-view">
              <text class="left-content">单号：{{ item.billno || "" }} </text>
              <text :class="item.flowstatus === '0' ? 'no' : 'ok'">
                {{ item.flowstatusDescr || "" }}
              </text>
            </view>
            <view class="flex-row-view">
              <text>门店：</text>
              <text class="center-text">
                {{ item.stkid || "" }}-{{ item.stkidDescr || "" }}</text
              >
              <text :class="item.status === '1' ? 'no' : ''">
                {{ item.statusDescr || "" }}</text
              >
            </view>
            <view class="flex-row-view">
              <text>联系人：</text>
              <text>{{ item.consignee || "" }} </text>
              <text class="last-text">{{ item.shoptel || "" }}</text>
            </view>
            <view class="flex-row-view">
              <view class="flex-column-view">
                <text>申请时间：{{ item.createtime || "" }}</text>
                <text
                  class="content-text"
                  :class="{
                    'content-text-no':
                      item.flowstatus !== '0' || item.status !== '1',
                  }"
                  >名称：{{ item.className || "" }}</text
                >
              </view>
              <!--生效单据 flowstatus 和未指派 status 状态可以进行抢单-->
              <view
                class="buttom-btn jjy-font-size"
                :class="
                  item.urgency === '1'
                    ? 'buttom-btn-urgency'
                    : 'buttom-btn-daily'
                "
                v-if="item.flowstatus === '0' && item.status === '1'"
                @click.stop="getApply(item, $event)"
                :data-res="item"
              >
                {{ userType === "0" ? "指派" : "抢单" }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <!--申请列表的内容 无-->
      <view
        :class="{
          'user-type-content-null': userType != 0,
          'apply-wrap-content-null': userType == 0,
        }"
        v-else
      >
        <text>~暂无待办维修申请单~</text>
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
      list: ["待审核", "待指派"],
      curNow: 0,
      // 当前列表数据
      applyList: [],
    };
  },
  onShow() {
    // 1. 将数据清空
    this.applyList = [];
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
    goApplyDetail(item, event) {
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url:
          "./detail?type=" +
          this.type +
          "&isDetail=" +
          true +
          "&billno=" +
          dataRes.billno,
      });
    },
    /**
     * 抢单
     */
    getApply(item, event) {
      let dataRes = item;
      if (!dataRes) {
        dataRes = event.currentTarget.dataset.res;
      }
      uni.navigateTo({
        url: "./detail?type=" + this.type + "&billno=" + dataRes.billno,
      });
    },
    // 上拉刷新
    onPullDownRefresh() {
      // 1. 将数据清空
      this.applyList = [];
      this.total = 0;
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
      };
      // 2. 获取数据
      this.getBillLists();
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
      // 获取当前用户的用户类型 0-内部用户, 1-供应商用户
      const userType = this.userType;
      const workCondition = userType ? this.curNow + 1 : "1";
      // 获取微信申请单列表
      const res = await this.service.apply.getApplyBills(this.pageInfo, {
        workCondition,
      });
      this.applyList = [...this.applyList, ...res.data]; //列表数据赋值
      this.total = res.total; //数据总数赋值
      uni.stopPullDownRefresh(); //数据请求完成 关闭上拉刷新
    },
    sectionChange(index) {
      this.curNow = index;
      // 1. 将数据清空
      this.applyList = [];
      this.total = 0;
      this.pageInfo = {
        pageIndex: 1,
        pageSize: 10,
      };
      // 2. 获取数据
      this.getBillLists();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.mine-layout-wrap {
  background: $jjy-zcwx-bg;
}
.apply-wrap {
  height: 100%;
  background-color: $jjy-zcwx-bg;
  padding: 0;
  margin: 0;
  overflow: hidden;
  .apply-search {
    padding: 24upx;
  }
  /* 没有新增按钮*/
  .apply-wrap-content,
  .apply-wrap-content-null {
    height: calc(100% - 40px);
    width: 750upx;
  }
  .user-type-content,
  .user-type-content-null {
    height: calc(100% - 10px);
    width: 750upx;
  }

  .apply-wrap-content-null,
  .user-type-content-null {
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    text {
      text-align: center;
      color: $jjy-zcwx-gray;
    }
  }
  .apply-item {
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    margin-bottom: 24upx;
    .apply-left-type {
      flex: 1;
    }
    .apply-center-content {
      flex: 5;
      padding: 5px 10px;
      text {
        display: block;
        padding-top: 5upx;
      }
      .flex-row-view {
        display: flex;
        flex-direction: row;
        // justify-content: space-between;
        // padding-right: 5px;
        // text:first-child {
        //   flex: 2;
        //   max-width: 400upx;
        //   white-space: nowrap;
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        // }
        // text:last-child {
        //   flex: 1;
        //   text-align: right;
        //   white-space: nowrap;
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        // }
        .left-content {
          flex: 1;
          max-width: 570upx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .center-text {
          flex: 1;
          max-width: 510upx;
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
        .flex-column-view {
          flex: 3;
          // display: flex;
          // flex-direction: column;
          text {
            text-align: left;
            display: block;
          }
          .content-text {
            max-width: 440upx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .content-text-no {
            max-width: 650upx;
          }
        }
        .buttom-btn {
          flex: 1;
          margin-left: 5upx;
          border-radius: 18upx;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        // 紧急是 指派按钮样式
        .buttom-btn-urgency {
          color: $jjy-zcwx-pink;
          border: 2upx solid $jjy-zcwx-pink;
        }
        .buttom-btn-daily {
          color: $jjy-zcwx-main;
          border: 2upx solid $jjy-zcwx-main;
        }
      }
    }
  }
}
</style>
