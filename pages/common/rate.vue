<!--
 * @Descripttion: 公用的评价界面组件
 * @Author: jsw丶郁
 * @Date: 2022-04-06 10:53:42
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-11 10:30:28
-->
<template>
  <mine-layout
    :btnList="applyBtnList"
    @handleBtn="goSubmitRate"
    :isShowBtn="!isHasRate"
    v-if="isSuccess"
  >
    <view
      class="rate-wrap jjy-font-size"
      :class="{ 'rate-wrap-no': isHasRate }"
    >
      <!-- 顶部的单据信息-->
      <view class="rate-top-wrap">
        <view>
          <text>联系信息：</text>
          <text>{{ billObj.repairtel || billObj.repairTel }}</text>
          <text> {{ billObj.repairname || billObj.repairName }}</text>
        </view>
      </view>
      <!-- 评价内容信息-->
      <view class="rate-center-wrap">
        <view v-for="item in scoreList" :key="item.itemCode">
          <text>{{ item.itemName }}</text>
          ：
          <u-rate
            v-model="item.score"
            size="28px"
            active-color="#ffbb45"
            :disabled="isHasRate"
            class="mystar"
          ></u-rate>
        </view>
      </view>
      <!-- 评价内容-->
      <view>
        <u--textarea
          placeholder="请填写故障的详细描述，不要超过50个汉字"
          :count="true"
          :disableDefaultPadding="true"
          maxlength="50"
          style="padding: 100upx"
          v-model="remark"
          :disabled="isHasRate"
        >
        </u--textarea>
      </view>
      <view v-if="!isHasRate">
        <up-image @getUpImage="getUpImage"> </up-image>
      </view>
      <view v-else>
        <text v-if="upImage">照片：</text>
        <mine-album :imageArr="upImage"></mine-album>
      </view>
    </view>
  </mine-layout>
</template>

<script>
import MineAlbum from "../../components/mineAlbum/mineAlbum.vue";
import mineLayout from "../../components/mineLayout/mineLayout.vue";
import UpImage from "../../components/upImage/upImage.vue";
export default {
  components: { mineLayout, UpImage, MineAlbum },
  data() {
    return {
      isSuccess: false,
      applyBtnList: [
        {
          name: "提交",
          type: "ok",
          background: "#70A4F8",
          isDisabled: false,
        },
      ],
      upImage: [],
      scoreList: [],
      billObj: {},
      isHasRate: false, //是否存在评价
      billCode: "",
      remark: "", //评价
    };
  },
  onLoad(option) {
    uni.showLoading({
      title: "加载中",
      mask: true,
    });
    this.billCode = option.billCode;
    const that = this;
    // 获取 eventChannel 事件频道
    const eventChannel = this.getOpenerEventChannel();
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过事件频道 eventChannel 传送到当前页面的数据
    eventChannel?.once("getBill", async function (res) {
      that.billObj = res;
      const result1 = await that.service.score.getScores();
      result1.data.forEach((item) => {
        item.itemName = item.itemName.slice(0, 8);
        item.score = 5;
      });
      that.scoreList = result1.data;
      const result2 = await that.service.score.getScoresByBillNo(res.billno);
      // 是否已经评价过了
      if (result2.data) {
        that.isHasRate = true;
        result2.data.scores.forEach((item) => {
          item.itemName = item.itemName.slice(0, 8);
        });
        that.scoreList = result2.data.scores;
        that.remark = result2.data.remark;
        that.upImage = result2.data.annexes;
      } else {
        //还未评价
        that.isHasRate = !res.canInsertScore;
      }
      that.isSuccess = true;
    });
  },
  methods: {
    // 提交评价
    async goSubmitRate() {
      const submitRate = {
        billNo: this.billObj.billno,
        billCode: this.billCode,
        remark: this.remark,
        scores: this.scoreList,
        annexes: [],
      };
      const annexes = await this.upAnnexes(this.upImage);
      if (!annexes) {
        return;
      }
      submitRate.annexes = annexes;
      await this.service.score.addScores(submitRate);
      uni.showToast({
        title: "评价成功",
        icon: "none",
        duration: 2500,
        mask: true,
      });
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        });
      }, 2500);
    },
    // 上传图片
    getUpImage(images) {
      this.upImage = images;
    },
    // 上传图片
    async upAnnexes(images) {
      const res = await this.service.annexes.upAnnexes(images);
      return res;
    },
  },
};
</script>

<style scoped lang="scss">
.rate-wrap {
  padding: 20upx;
  height: calc(100vh - 88px);
  background: #fff;
  overflow: auto;
  .rate-top-wrap {
    background: #f4f4f4;
    border-radius: 15upx;
    padding: 10upx;
    view {
      display: flex;
      flex-direction: row;
      text:last-child {
        margin-left: 10upx;
      }
    }
  }
  .rate-center-wrap {
    view {
      display: flex;
      flex-direction: row;
      align-items: center;
      text {
        display: block;
        height: 28px;
        line-height: 28px;
        width: 280rpx;
        /* 文字两端对齐 */
        text-align: justify;
        text-align-last: justify;
        text-justify: inter-ideograph; /*兼容ie*/
      }
    }
  }
  view {
    padding: 10upx 0;
  }
}
.rate-wrap-no {
  height: calc(100% - 40upx);
}
/deep/.uicon-star-fill {
  color: #ffbb45 !important;
}
/deep/.u-icon__icon {
  padding: 10upx;
}
</style>
