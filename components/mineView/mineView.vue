<template>
  <view class="item">
    <view
      class="it"
      :id="index"
      :style="{ left: cruentIndex == index ? left : '0' }"
      @click="cheaks(index)"
      @touchstart="touchstart"
      @touchmove="touchmove"
    >
      <slot name="item"></slot>
    </view>
    <view
      class="del"
      :style="{ right: cruentIndex == index ? right : '-150upx' }"
      @click="del(cruentIndex)"
    >
      <u-icon name="trash" color="#fff" size="30px"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    isReast: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lastIndex: "",
      cruentIndex: "",
      startX: "",
      endX: "",
      left: "",
      right: "",
    };
  },
  methods: {
    cheaks(index) {
      // 点击之后 全部复原
      this.$emit("clickItem", index);
    },
    touchstart(e) {
      this.startX = e.touches[0].clientX; // 获取其实滑动位置
      this.right = "-150rpx";
      this.left = "0";
      this.$emit("clickSlide", true);
    },
    touchmove(e) {
      this.endX = e.touches[0].clientX; // 获取滑动结束位置
      let index = e.currentTarget.id; // 获取当前滑动的滑块的index，在遍历的时候有绑定。
      let cha = this.startX - this.endX; // 计算滑动启示位置和结束位置的差值

      if (cha > 30) {
        this.right = "0";
        this.left = "-150rpx";
      } else {
        // 表示右滑，操作跟左滑相反即可
        this.cruentIndex = index;
        this.right = "-150rpx";
        this.left = "0";
      }
      this.$emit("clickSlide", false);
    },
    del(index) {
      this.$emit("clickDelete", index);
    },
  },
  watch: {
    isReast(newVal, oldVal) {
      if (newVal) {
        this.right = "-150rpx";
        this.left = "0";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #fff;
  margin-bottom: 20upx;
  .it {
    transition: 0.4s;
    height: 100%;
    position: absolute;
    left: 0;
    width: 100%;
  }

  .del {
    transition: 0.4s;
    position: absolute;
    right: -150upx;
    background-color: #f87070;
    height: 100%;
    width: 150upx;
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
  }
}
</style>
