<!--
 * @Descripttion: 自定义相册组件
 * @Author: jsw丶郁
 * @Date: 2022-04-02 14:19:49
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-19 10:56:58
-->
<template>
  <view class="album-image-wrap">
    <view class="image_wrap">
      <view
        class="image_content"
        v-for="(item, index) in iamgePath"
        :key="index"
      >
        <image :src="item" @click="previewUpImg(index)"></image>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "albumImage",
  data() {
    return {
      iamgePath: [],
    };
  },
  props: {
    imageArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  onLoad(optoons) {
    this.downthumbAnnexes(this.imageArr);
  },
  methods: {
    /**
     * 预览图片
     */
    async previewUpImg(index) {
      const res = await this.service.annexes.downAnnexes(this.imageArr);
      uni.previewImage({
        urls: res,
        current: index,
      });
    },
    /**
     * 获取缩略图地址
     */
    async downthumbAnnexes(ids) {
      const res = await this.service.annexes.downthumbAnnexes(ids);
      this.iamgePath = res;
    },
  },
  watch: {
    imageArr: {
      immediate: true,
      handler(newVal, oldVal) {
        this.downthumbAnnexes(newVal);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.album-image-wrap {
  display: flex;
  flex-direction: column;
}
.image_wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15upx;
}
.image_wrap .image_content {
  display: flex;
  flex-direction: row;
  position: relative;
}
.image_content image {
  margin-left: 10upx;
  margin-bottom: 20upx;
  width: 130upx;
  height: 100upx;
  border: 2upx solid #ccc;
  border-radius: 10upx;
}
</style>
