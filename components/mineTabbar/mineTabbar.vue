<!--
 * @Descripttion: 自定义底部的tabbar组件
 * @Author: jsw丶郁
 * @Date: 2022-05-05 09:46:05
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 13:53:06
-->
<template>
  <view class="tab-block">
    <ul class="tab-list">
      <li
        v-for="(item, index) in tabList"
        class="list-item"
        :class="item.middleClass"
        @click="handlePush(item, index)"
        :key="index"
      >
        <view class="item-img-box" >
          <image
            class="item-img"
            :src="tabIndex == index ? item.selectedIconPath : item.iconPath"
          >
        </view>
        <view
          class="item-text"
          :class="{ specialColor: tabIndex == index }"
        >
          {{ item.text }}
        </view>
      </li>
    </ul>

    <!-- 兼容iPhonex下面的小黑条 -->
    <view class="tab-bar" v-show="showTabBar === true"></view>
  </view>
</template>

<script>
export default {
  props: {
    tabIndex: {
      //当前选中的tab项
      type: Number,
      default: 0,
    },
    isShow:{ // 是否显示中间突出的一块
       type: Boolean,
      default: false,
    },
	userType:{
		type:String,
		default:'0'
	}
  },
  data() {
    return {
      /*
       * iconPath: 默认icon图片路径
       * selectedIconPath: 选中icon图片路径
       * text: tab按钮文字
       * pagePath:页面路径
       * middleClass:该按钮所有的特殊样式类名
       * tabList最小两项，最多五项
       * tabList长度为奇数时，中间按钮才会突出显示
       *
       */
      tabList: [
        {
          pagePath: "../../pages/home/index",
          iconPath: "../../static/images/home.png",
          selectedIconPath: "../../static/images/home-xz.png",
          text: "工作区",
          middleClass:"",
          router:"switchTab"
        },
        {
          pagePath: "../../pages/wxapply/add",
           iconPath: "../../static/images/add2.png",
          selectedIconPath: "../../static/images/add2.png",
          text: "",
          middleClass:""
        },
        {
          pagePath: "../../pages/mine/index",
          iconPath: "../../static/images/mine.png",
          selectedIconPath: "../../static/images/mine-xz.png",
          text: "我的",
          middleClass:"",
          router:"switchTab"
        },
      ],
      showTabBar: false,
      showMiddleButton: false,
    };
  },
  computed: {
    getHeight() {
      return Number(this.height);
    },
  },
  mounted() {
    this.getSystemInfo();
    this.setTabBar();
  },
  methods: {
    //判断中间按钮是否突出显示，奇数or偶数，奇数突出
    setTabBar() {
      let tabLength = this.tabList.length;
      if (tabLength % 2) {
        this.showMiddleButton = true;
        // 向上取整
        let middleIndex = Math.floor(tabLength / 2);
        // 给中间的添加mid-button
        this.tabList[middleIndex].middleClass = "mid-button";
        
      // 如果不是第一个界面  突出的按钮隐藏
        if(this.tabIndex!==0 || !this.isShow){
        this.tabList[middleIndex].middleClass = "hidden-button";
        }
      }
      
    },

    //点击按钮
    handlePush(item, index) {
      if (this.tabIndex !== index && item.router==='switchTab') {
        uni.switchTab({
          url: item.pagePath,
        });
      }else{
		  this.userType === '0'
			? uni.navigateTo({
			  url: item.pagePath,
			})
			: uni.navigateTo({
				url:'/pages/wbreg/add'
			})
			
			
      }
    },

    //兼容iPhoneX以上底部黑线条的显示
    getSystemInfo() {
      //获取系统信息
      uni.getSystemInfo({
        success: (res) => {
          // X及以上的异形屏top为44，非异形屏为20
          if (res.safeArea.top > 20) {
            this.showTabBar = true;
          }
        },
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.tab-block {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  .tab-list {
    height: 100rpx;
    width: 750rpx;
    display: flex;
    flex-direction: row;
    border-top: 1px solid $jjy-zcwx-gray;
    .list-item { 
      position: relative;
      flex: 1;
      height: 100rpx;
      font-size: 30rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .item-img-box{
        .item-img {
             width: 44rpx;
             height: 42rpx;
         }
      }
      .specialColor{
          color: $jjy-zcwx-main;
      }
    }
    .mid-button{
        position: relative;
        .item-img-box {
           position: absolute;
           z-index: 1002;
           bottom: 0rpx;
           width: 150rpx;
           height:150rpx;
          .item-img {
             width: 100%;
             height: 100%;
         }
        }
             
    } 
    .hidden-button{
        display: none;
    }
  }
}
</style>
