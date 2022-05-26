<!--
 * @Descripttion: 功能权限以及列表操作的mixins
 * @Author: jsw丶郁
 * @Date: 2022-04-11 09:52:48
 * @LastEditors: jsw丶郁
 * @LastEditTime: 2022-04-19 16:29:22
-->
<script>
export default {
  data() {
    return {
      // 分页信息
      pageInfo: {
        pageIndex: 1, //当前页
        pageSize: 10, //分页大小
      },
      total: 0, //当前单据列表的总数
      type: "", // 当前功能的类型
      rightObj: {}, //当前功能的权限对象
      userInfo: {},
      userType: "", //用户类型 0-内部用户,1-供应商用户
      searchVal: "", // 查询的值
    };
  },
  onLoad(options) {
    // 当前跳转时获取功能的类型
    this.type = options.type;
    // 1. 获取用户权限信息
    this.userInfo = uni.getStorageSync("userInfo");
    const { permissionList, usertype } = this.userInfo;
    this.userType = usertype;
    // 2. 判断当前用户在此功能的权限
    const rightList = permissionList.filter(
      (item) => item.funcno === options.type
    );
    //3. 赋值当前功能的权限
    this.rightObj = rightList[0];
  },
};
</script>
