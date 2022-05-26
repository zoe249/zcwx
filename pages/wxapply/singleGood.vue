<!--
 * @Descripttion: 单个商品详情
 * @Author: jsw丶郁
 * @Date: 2022-04-01 15:44:53
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-25 14:39:17
-->
<template>
  <mine-layout @handleBtn="goSubmintGood">
    <view class="single-good-wrap jjy-font-size" v-if="goodObj.code">
      <!--顶部搜索组件-->
      <view class="top-search-wrap">
        <search-input
          @handlerImg="handlerSearch"
          searchType="scan"
          searchIcon="scan"
          ref="searchInput"
        ></search-input>
      </view>
      <!--中间的表单提交内容-->
      <view class="form-content-wrap">
        <!--名称-->
        <text>名称：{{ goodObj.name || "" }}</text>
        <!--门店-->
        <view class="row-flex-view margin-view">
          <text class="flex-text">
            <text class="require-filed">*</text>门店：
          </text>
          <view v-if="isDisabled">
            <u-input
              placeholder="输入门店编码或名称"
              v-model="skt"
              disabled
            ></u-input
          ></view>
          <view v-else>
            <u-input placeholder="输入门店编码或名称" v-model="skt">
              <view class="search-store" slot="suffix">
                <u-icon
                  name="search"
                  @click="getStore(skt)"
                  color="#999"
                  size="28px"
                ></u-icon>
              </view>
            </u-input>
          </view>
        </view>
        <view class="row-flex-view">
          <view class="row-flex-view">
            <text class="flex-text"
              ><text class="require-filed">*</text>联系人：</text
            >
            <view>
              <u-input
                placeholder="输入联系人"
                v-model="submitGood.consignee"
                border="none"
              >
              </u-input>
            </view>
          </view>
          <view class="row-flex-view">
            <text class="flex-text"
              ><text class="require-filed">*</text>电话：</text
            >
            <view>
              <u-input
                placeholder="输入电话"
                v-model="submitGood.shoptel"
                type="number"
                border="none"
              >
              </u-input>
            </view>
          </view>
        </view>
        <view class="row-flex-view">
          <text>类别：{{ goodObj.classTypeDescr || "" }}</text>
          <text>编码：{{ goodObj.code || "" }}</text>
        </view>
        <view class="radio-flex-view">
          <text class="flex-text">
            <text class="require-filed">*</text>
            报修原因：</text
          >
          <mine-radio
            @radioClick="getBxClick"
            :radioList="bxList"
            :checkValue="submitGood.mtReason"
          ></mine-radio>
        </view>
        <view class="radio-flex-view">
          <text class="flex-text">
            <text class="require-filed">*</text>
            紧急程度：</text
          >
          <mine-radio
            @radioClick="getJjClick"
            :radioList="jjList"
            :checkValue="submitGood.urgency"
          ></mine-radio>
        </view>
        <view>
          <u--textarea
            placeholder="请填写故障的详细描述，不要超过50个汉字"
            :count="true"
            :disableDefaultPadding="true"
            maxlength="50"
            style="padding: 100upx"
            v-model="submitGood.remark"
          >
          </u--textarea>
        </view>
        <view>
          <u--input
            placeholder="添加备注"
            border="surround"
            v-model="submitGood.remark1"
          ></u--input>
        </view>
        <view>
          <up-image @getUpImage="getUpImage"></up-image>
        </view>
      </view>
      <!-- 弹出门店选择框-->
      <u-popup
        :show="showStore"
        mode="right"
        closeOnClickOverlay
        @close="closeStore"
      >
        <scroll-view
          scroll-y="true"
          @scrolltolower="loadApply"
          class="multi-good-content-wrap"
        >
          <view
            class="store-item"
            v-for="item in storeList"
            :key="item.stkid"
            @click="checkStore(item)"
          >
            <text>{{ item.stkid || "" }}</text>
            <text>{{ item.nameStk || "" }}</text>
          </view>
        </scroll-view>
      </u-popup>
    </view>
  </mine-layout>
</template>
<script>
import mineLayout from "../../components/mineLayout/mineLayout.vue";
import MineRadio from "../../components/mineRadio/mineRadio.vue";
import SearchInput from "../../components/searchInput/searchInput.vue";
import UpImage from "../../components/upImage/upImage.vue";
import func from "../../mixin/func.vue";
export default {
  components: { mineLayout, MineRadio, UpImage, SearchInput },
  mixins: [func],
  data() {
    return {
      bxList: [], //报修数组
      jjList: [], //紧急数组
      upImage: [], //上传图片数组
      goodObj: {},
      submitGood: {
        annexes: [],
        urgency: 0,
        mtReason: 0,
        remark: "",
        remark1: "",
        urgencyDescr: "",
        mtReasonDescr: "",
      },
      skt: "", // 输入的门店
      isDisabled: false,
      showStore: false,
      storeList: [],
      pageInfo: {
        pageIndex: 1, //当前页
        pageSize: 20, //分页大小
      },
    };
  },
  onLoad: function (option) {
    const that = this;
    // 获取 eventChannel 事件频道
    const eventChannel = this.getOpenerEventChannel();
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过事件频道 eventChannel 传送到当前页面的数据
    eventChannel.once("getGoods", function (res) {
      that.goodObj = res;
      that.isSbType(res);
    });
    this.getDicts();
    this.getUserInfo();
  },
  methods: {
    async handlerSearch(val) {
      const res = await this.service.base.getClass(
        { pageIndex: 1, pageSize: 10 },
        val
      );
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
          this.goodObj = data[0];
          this.isSbType(data[0]);
          break;
        default: // 查询出多个商品的数据
          uni.setStorageSync("_tempMultiGoods", {
            data,
            total,
            searchVal: val,
          });
          this.routerBack("pages/wxapply/multiGoods").catch((error) => {
            uni.navigateTo({
              url: "./multiGoods?type=" + this.type,
            });
          });
          break;
      }
    },
    /**
     * 提交维修请求
     */
    async goSubmintGood() {
      const { name, code, classTypeName } = this.goodObj;

      this.submitGood = {
        ...this.submitGood,
        ...{
          className: name,
          classCode: code,
          classTypeName,
        },
      };
      if (this.submitGood.stkid === "") {
        uni.showToast({
          title: "门店不可为空",
          icon: "none",
        });
        return;
      }
      if (this.submitGood.shoptel === "") {
        uni.showToast({
          title: "联系电话不能为空",
          icon: "none",
        });
        return;
      }
      if (this.submitGood.consignee === "") {
        uni.showToast({
          title: "联系人不能为空",
          icon: "none",
        });
        return;
      }
      const annexes = await this.upAnnexes(this.upImage);
      if (!annexes) {
        return;
      }
      console.log("annexes", annexes);
      this.submitGood.annexes = annexes;
      // 暂时缓存需要提交的申请单数据
      const _tempApplyList = uni.getStorageSync("_tempApplyList") || [];
      // 判断当前的维修单是否存在未提交
      const isHas = _tempApplyList.some(
        (item) =>
          item.classCode === this.submitGood.classCode &&
          item.stkid === this.submitGood.stkid
      );
      if (isHas) {
        uni.showToast({
          title: "当前维修申请已存在",
          icon: "none",
        });
        return;
      }
      _tempApplyList.push(this.submitGood);
      uni.setStorageSync("_tempApplyList", _tempApplyList);
      this.routerBack("pages/wxapply/add");
    },
    // 获取下拉框值 报修原因以及紧急程度
    getDicts() {
      Promise.all([
        this.service.base.getDicts("474"),
        this.service.base.getDicts("471"),
      ]).then((res) => {
        res[0].data.forEach((item) => {
          this.bxList.push({
            label: item.descr,
            value: item.systemCode,
          });
        });
        res[1].data.forEach((item) => {
          this.jjList.push({
            label: item.descr,
            value: item.systemCode,
          });
        });
        this.submitGood.mtReason = res[0].data[0].systemCode;
        this.submitGood.mtReasonDescr = res[0].data[0].descr;
        this.submitGood.urgency = res[1].data[0].systemCode;
        this.submitGood.urgencyDescr = res[1].data[0].descr;
      });
    },
    getBxClick(val, label) {
      this.goodObj.mtReason = val;
      this.submitGood.mtReason = val;
      this.submitGood.mtReasonDescr = label;
    },
    getJjClick(val, label) {
      this.goodObj.urgency = val;
      this.submitGood.urgency = val;
      this.submitGood.urgencyDescr = label;
    },
    getUpImage(images) {
      this.upImage = images;
    },
    // 获取当前登录用户的信息
    getUserInfo() {
      const userInfo = uni.getStorageSync("userInfo");
      this.submitGood = {
        ...this.submitGood,
        consignee: userInfo.username,
        shoptel: userInfo.handset || "",
      };
    },
    //判断当前类型是否为设备类型
    isSbType(item) {
      if (item.classType === "1") {
        this.submitGood.stkid = item.stkid;
        this.isDisabled = true;
        this.getStore(item.stkid);
      } else {
        this.skt = "";
        this.submitGood.stkid = "";
        this.isDisabled = false;
        this.getStore("");
      }
    },
    async getStore(stk) {
      const res = await this.service.store.getStore(this.pageInfo, stk);
      if (this.isDisabled) {
        this.skt = res.data[0].nameStk;
      } else {
        this.storeList = res.data;
        this.total = res.total;
        if (res.data.length > 1) {
          this.showStore = true;
        } else if (res.data[0]) {
          this.skt = res.data[0].nameStk;
          this.submitGood.stkid = res.data[0].stkid;
        } else {
          uni.showToast({
            title: "未查询到门店信息",
            icon: "none",
          });
        }
      }
    },
    // 上滑加载 加载下一页数据
    async loadApply() {
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
      const res = await this.service.store.getStore(this.pageInfo, this.stk);
      this.storeList = [...this.storeList, ...res.data];
      this.total = res.total;
    },
    closeStore() {
      this.showStore = false;
      this.pageInfo = {
        pageIndex: 1, //当前页
        pageSize: 20, //分页大小
      };
    },
    checkStore(item) {
      this.skt = item.nameStk;
      this.submitGood.stkid = item.stkid;
      this.closeStore();
    },
    // 上传图片
    async upAnnexes(images) {
      const res = await this.service.annexes.upAnnexes(images);
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.single-good-wrap {
  padding: 0 20upx;
  color: #333333;
  overflow: hidden;
  height: 100%;
  background: #fff;
  .top-search-wrap {
    background: #f4f4f4;
    margin: 24upx 0upx;
  }
  .form-content-wrap {
    margin-top: 10upx;
    height: calc(100% - 40px);
    overflow: auto;
    text {
      margin-bottom: 10upx;
    }
    view {
      margin-bottom: 10upx;
    }
    .row-flex-view {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .flex-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      text:last-child {
        text-align: left;
        width: 50%;
      }
      view {
        flex: 1;
      }
    }
    .margin-view {
      margin: 20upx 0;
      .search-store {
        display: flex;
        flex-direction: row;
      }
    }
    .radio-flex-view {
      display: flex;
      flex-direction: row;
      margin-top: 20upx;
      .flex-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
.picker {
  display: flex;
  flex-direction: row;
  text-align: center;
  height: 60upx;
  line-height: 60upx;
  text {
    display: block;
    flex: 1;
    background: #f4f4f4;
    text-align: left;
    padding-left: 20upx;
    height: 60upx;
    color: #999;
    border-top-left-radius: 15upx;
    border-bottom-left-radius: 15upx;
  }
  view {
    background: #f4f4f4;
    height: 60upx;
    padding-right: 10upx;
    border-top-right-radius: 15upx;
    border-bottom-right-radius: 15upx;
  }
}
.multi-good-content-wrap {
  height: 100vh;
  width: 250upx;
  padding: 0 10upx;
  .store-item {
    margin: 10upx 0;
    border: 1upx solid $jjy-zcwx-gray;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20upx 10upx;
    text:last-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
/deep/.u-input--radius {
  border-radius: 15upx;
}
</style>
