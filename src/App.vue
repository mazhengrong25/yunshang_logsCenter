<template>
  <el-container id="app">
    <el-header>
      <nav-div :navList="navList"></nav-div>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
    <el-footer>
      <footer-div></footer-div>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: "App",
    components: {
      'navDiv': () => import('@/components/Nav'),
      'FooterDiv': () => import('@/components/Footer')
    },
    data(){
      return {
        navList: [
          {
            name: '日志查询',
            path: '/'
          },{
          name: '查询配置',
            path: '/settingViews'
          },{
            name: '使用说明',
            path: '/readme'
          }
        ]
      }
    },
  }
</script>

<style scoped lang="less">
  // 样式清除
  #app{
    height: 100%;
  }
  /deep/.el-header{
    height: unset !important;
    padding: unset !important;
  }
  /deep/.el-footer{
    padding: unset !important;
  }
  /deep/.el-table--small{
    .el-table__body-wrapper{
      font-size: 14px !important;
    }
  }
</style>
