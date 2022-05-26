<!--
 * @Descripttion: 首页
 * @Author: jsw丶郁
 * @Date: 2022-03-30 10:39:28
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-05-10 10:49:51
-->
<template>
  <view class="home_wrap">
    <!--顶部的欢迎内容-->
    <view class="home_top">
      <text class="jjy-font-size-big"> 你好,{{ userName }} ！</text>
    </view>
    <!--待办事项-->
    <view class="home-todo-content">
      <text class="jjy-font-size-big">待办事项</text>
      <view class="todo-list jjy-font-size">
        <view
          class="todo-item"
          v-for="item in todoList"
          :key="item.type"
          @click="goTodoClick(item.path, item.type)"
        >
          <view class="todo-item-content">
            <image :src="item.imgUrl"></image>
            <text>{{ item.name }}</text>
          </view>
          <view class="todo-badge" v-if="item.badgeNum">
            <u-badge max="99" :value="item.badgeNum"></u-badge>
          </view>
        </view>
      </view>
    </view>
    <!--主要的功能列表内容-->
    <view class="home-content-wrap">
      <text class="jjy-font-size-big">功能模块</text>
      <view class="home-content">
        <view
          class="home-func-list jjy-border-radius"
          v-for="item in funcList"
          :key="item.type"
          :style="{ backgroundImage: 'url(' + item.bgImg + ')' }"
          @click="openFunc(item.path, item.type)"
        >
          <view class="func-content">
            <image :src="item.icon" class="func-icon"></image>
            <text class="func-name">{{ item.name }}</text></view
          >
        </view>
      </view>
    </view>
	
    <mine-tabbar :tabIndex="0" :isShow="true" :userType="userType"></mine-tabbar>
    <float-ball></float-ball>
	
  </view>
</template>
<script>
import { _funcList } from "../../static/js/index.js";
export default {
  data() {
    return {
      userName: "",
	  userType:"", // 用户类型
      funcImg: [
        {
          icon: "../../static/images/wxsq.png", // 功能图标
          type: "m_mt_apply", //功能类型
          path: "../wxapply/list",
        },
        {
          icon: "../../static/images/yssq.png", // 功能图标
          type: "m_mt_budget", //功能类型
          path: "../ysbudget/list",
        },
        {
          icon: "../../static/images/wxqr.png", // 功能图标
          type: "m_mt_confirm", //功能类型
          path: "../wxconfirm/list",
        },
        {
          icon: "../../static/images/wbdj.png", // 功能图标
          type: "m_mt_reg", //功能类型
          path: "../wbreg/list",
        },
      ],
      todoList: [
        {
          imgUrl: "../../static/images/wxsq-db.png",
          name: "维修申请",
          type: "m_mt_apply",
          minType: "apply",
          badgeNum: "0",
          path: "../wxapply/todoList",
        },
        {
          imgUrl: "../../static/images/yssq-db.png",
          name: "预算申请",
          type: "m_mt_budget",
          badgeNum: "0",
          minType: "budget",
          path: "../ysbudget/todoList",
        },
        {
          imgUrl: "../../static/images/wxqr-db.png",
          name: "维修确认",
          type: "m_mt_confirm",
          minType: "confirm",
          badgeNum: "0",
          path: "../wxconfirm/todoList",
        },
        {
          imgUrl: "../../static/images/wbdj-db.png",
          name: "维保登记",
          type: "m_mt_reg",
          badgeNum: "0",
          minType: "reg",
          path: "../wbreg/todoList",
        },
      ],
      funcList: [],
      hasAddRight: false, // 是否有添加维修申请的权限
    };
  },
  computed: {},
  onLoad: function (options) {
    const token = uni.getStorageSync("token");
    if (!token) {
      uni.redirectTo({
        url: "../login/index",
      });
    }
    // 1. 获取登录用户的功能权限信息
    const { username, permissionList,usertype } = uni.getStorageSync("userInfo");
    this.userName = username || "用户"; // 当前登录用户的名称
	this.userType = usertype || ""
    this.setFuncList(permissionList || []);
    this.hasAddRight = permissionList.filter(
      (item) => item.funcno === "m_mt_apply"
    )[0].addright;
	// 1.内部用户展示添加申请单，供应商用户添加维保申请单
  },
  onShow() {
    uni.hideTabBar();
    this.getWork();
  },
  methods: {
    // 设置功能权限
    setFuncList(permissionList) {
      let func = [];
      // 匹配所有的功能权限
      this.funcImg.forEach((item) => {
        _funcList.forEach((list) => {
          if (item.type === list.value) {
            func.push({ ...list, ...item });
          }
        });
      });
      // 获取当前需要的功能权限
      func.forEach((item) => {
        permissionList.forEach((list) => {
          // 1. 必须存在功能权限，必须具有查询功能权限
          if (list.funcno === item.type && list.queright) {
            this.funcList.push(item);
          }
        });
      });
    },
    // 跳转功能路径
    openFunc(path, type) {
      uni.navigateTo({
        url: path + "?type=" + type,
      });
    },
    goTodoClick(path, type) {
      uni.navigateTo({
        url: path + "?type=" + type,
      });
    },
    async getWork() {
      const res = await this.service.user.getWork();
      this.todoList.forEach((item) => {
        item.badgeNum = res.data[item.minType + "Count"];
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home_wrap {
  display: flex;
  flex-direction: column;
}
.home_top {
  color: $jjy-zcwx-main;
  padding: 20upx;
}
.home-todo-content {
  background: #f4f4f4;
  padding: 20upx;
  height: 240upx;
  .todo-list {
    padding: 20upx 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    .todo-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      .todo-item-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        image {
          width: 130upx;
          height: 120upx;
          margin-bottom: 20upx;
        }
      }
      .todo-badge {
        position: absolute;
        right: 30rpx;
        top: -10rpx;
      }
    }
  }
}
.home-content-wrap {
  padding: 20upx;
  .home-content {
    margin-top: 20upx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
.home-func-list {
  width: 350upx;
  height: 200upx;
  margin-bottom: 20upx;
  background-size: 100% 100%;
}
.func-content {
  width: 100%;
  padding: 20upx;
  display: flex;
  flex-direction: row;
  color: #fff;
}
.func-icon {
  width: 20px;
  height: 22px;
}
.func-name {
  margin-left: 10upx;
  height: 22px;
  line-height: 22px;
  color: #fff;
}
</style>
