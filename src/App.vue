<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-03-20 17:25:59
 * @LastEditTime: 2021-01-12 16:21:32
 * @LastEditors: wish.WuJunLong
-->
<template>
  <el-container id="app">
    <el-header v-if="$route.name !== 'Login'">
      <nav-div :navList="navList"></nav-div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <!--
    <el-footer>
      <footer-div></footer-div>
    </el-footer>
    -->
  </el-container>
</template>

<script>
export default {
  name: "App",
  components: {
    navDiv: () => import("@/components/Nav"),
    FooterDiv: () => import("@/components/Footer"),
  },
  data() {
    return {
      navList: [
        {
          name: "日志查询",
          path: "/",
        },
        {
          name: "查询配置",
          path: "/settingViews",
        },
        {
          name: "日志统计",
          path: "/logsCharts",
        },
        {
          name: "使用说明",
          path: "/readme",
        },
      ],
    };
  },
};
</script>

<style scoped lang="less">
// 样式清除
#app {
  height: 100%;
}
/deep/.el-header {
  height: unset !important;
  padding: unset !important;
}
/deep/.el-footer {
  padding: unset !important;
}
/deep/.el-table--small {
  .el-table__body-wrapper {
    font-size: 14px !important;
  }
}
/deep/.el-table {
  .el-table__header {
    tr {
      color: #fff;
      th {
        background-color: rgba(0, 123, 255, 0.8);
        border-right: 1px solid #e6f0fa;
      }
    }
  }
  .el-table__body {
    .el-table__row {
      &.current-row {
        td {
          background: #d3eaff !important;
        }
      }
      &.el-table__row--striped {
        td {
          background: #f0f5fa;
        }
      }
    }
  }
}
/deep/.el-button.el-button--primary {
  background-color: rgba(0, 123, 255, 0.8);
  border-color: rgba(0, 123, 255, 0.8);
}
</style>
