<!--
 * @Descripttion: 新增维修申请界面
 * @Author: jsw丶郁
 * @Date: 2022-03-31 17:28:32
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-05 15:18:46
-->
<template>
  <mine-layout
    :btnList="applyBtnList"
    @handleBtn="submitapply"
    :isShowBtn="isShowBtn"
  >
    <view class="add-apply-wrap jjy-font-size">
      <!--顶部查询组件-->
      <view class="add-apply-search-wrap">
        <search-input
          @handlerImg="handlerSearch"
          searchType="scan"
          searchIcon="scan"
        ></search-input>
      </view>
      <!-- 中间新增的维修申请表单内容-->
      <view class="add-apply-content-wrap" v-if="applyList.length">
        <u-swipe-action>
          <u-swipe-action-item
            v-for="(item, index) in applyList"
            :key="index"
            :index="index"
            @click="delApply(index)"
            :options="options1"
          >
            <view class="add-apply-item">
              <view class="left-content">
                <view class="item top">
                  <text class="left-content">
                    名称：{{ item.className || "" }}
                  </text>
                  <view class="right-content">
                    <mine-badge :status="item.urgency">
                      <text>{{ item.urgencyDescr || "" }}</text>
                    </mine-badge>
                  </view>
                </view>
                <view class="item top">
                  <text>联系信息：</text>
                  <text> {{ item.consignee || "" }}</text>
                  <text class="last-text">{{ item.shoptel || "" }}</text>
                </view>
                <view class="item top">
                  <view class="item-left-view">
                    <text>故障描述：{{ item.remark || "" }}</text>
                  </view>
                  <view class="item-right-view"
                    ><text>备注：{{ item.remark1 || "" }}</text>
                  </view>
                </view>
                <view class="item bottom">
                  <view class="item-left-view">
                    <text>编码：{{ item.classCode || "" }}</text>
                  </view>
                  <view class="item-right-view"
                    ><text>类别：{{ item.classTypeName || "" }}</text>
                  </view>
                </view>
                <view class="item bottom">
                  <text>报修原因：{{ item.mtReasonDescr || "" }}</text>
                </view>
              </view>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
      </view>
      <!--申请列表的内容 无-->
      <view class="apply-wrap-content-null" v-else>
        <text>~请扫描或手工输入报修设备~</text>
      </view>
    </view>
  </mine-layout>
</template>

<script>
import MineBadge from "../../components/mineBadge/mineBadge.vue";
import MineLayout from "../../components/mineLayout/mineLayout.vue";
import MineView from "../../components/mineView/mineView.vue";
import SearchInput from "../../components/searchInput/searchInput.vue";
import func from "../../mixin/func.vue";
export default {
  mixins: [func],
  data() {
    return {
      isReast: false,
      // 新增维修申请底部按钮
      applyBtnList: [
        {
          name: "提交申请",
          type: "ok",
          background: "#70A4F8",
        },
      ],
      options1: [
        {
          text: "删除",
          style: {
            backgroundColor: "#F87070",
          },
        },
      ],
      isShowBtn: false,
      applyList: [],
    };
  },
  components: { MineLayout, SearchInput, MineView, MineBadge },
  onShow() {
    const _tempApplyList = uni.getStorageSync("_tempApplyList") || [];
    this.applyList = _tempApplyList;
    if (_tempApplyList.length) {
      this.isShowBtn = true;
    }
  },
  methods: {
    clickItem(index) {
      this.isReast = true;
    },
    clickSlide(bool) {
      this.isReast = bool;
    },
    /**
     * 提交新增的维修申请单
     */
    submitapply() {
      this.service.apply.addApplyBills(this.applyList).then((res) => {
        uni.showToast({
          title: "维修申请提交成功",
          duration: 1000,
        });
        uni.removeStorageSync("_tempApplyList");
        setTimeout(() => {
          uni.removeStorageSync("_tempMultiGoods");
          this.routerBack("pages/wxapply/list");
        }, 1000);
      });
    },
    /**
     * 搜索维修申请单
     */
    async handlerSearch(val) {
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
          uni.navigateTo({
            url: "./singleGood?type=" + this.type,
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit("getGoods", data[0]);
            },
          });
          break;
        default: // 查询出多个商品的数据
          uni.setStorageSync("_tempMultiGoods", {
            data,
            total,
            searchVal: val,
          });
          uni.navigateTo({
            url: "./multiGoods?type=" + this.type,
          });
          break;
      }
    },
    delApply(index) {
      const _tempApplyList = uni.getStorageSync("_tempApplyList") || [];
      this.applyList = [];
      _tempApplyList.splice(index, 1);
      this.applyList = _tempApplyList;

      uni.setStorageSync("_tempApplyList", _tempApplyList);
    },
  },
};
</script>

<style scoped lang="scss">
.add-apply-wrap {
  overflow: hidden;
  height: 100%;
  background-color: #f4f4f4;
  padding: 0;
  margin: 0;
}
/**查询组件 */
.add-apply-search-wrap {
  margin: 10upx;
  background: #fff;
}
/**中间内容区域 */
.add-apply-content-wrap,
.apply-wrap-content-null {
  height: calc(100% - 40px);
  width: 750upx;
}
.apply-wrap-content-null {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  text {
    text-align: center;
    color: $jjy-zcwx-gray;
  }
}
.add-apply-item {
  width: 750upx;
  padding: 10upx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.apply-content {
  display: flex;
  flex-direction: row;
  width: 750upx;
  padding: 10upx;
}
.left-content {
  color: #999999;
  width: 730upx;
  padding-right: 10upx;
  .item {
    display: flex;
    flex-direction: row;
    margin-bottom: 10upx;
    .last-text {
      margin-left: 10upx;
    }
    .item-left-view,
    .item-right-view {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 360upx;
    }

    .left-content {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 700upx;
    }
  }
  .top {
    color: #333333;
  }
}
/deep/.u-swipe-action {
  margin: 10upx 0 20upx 0;
  height: calc(100vh - 210upx);
  overflow: auto;
}
/deep/.u-swipe-action-item {
  margin: 10upx 0 20upx 0;
}
</style>
