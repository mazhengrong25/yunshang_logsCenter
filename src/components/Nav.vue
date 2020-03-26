<template>
  <nav class="nav">
    <img class="logo" src="../assets/logo.png" alt="">
    <div class="nav_list">
      <router-link v-for="(item,index) in navList" :key="index" class="nav_btn" :to="item.path">{{item.name}}</router-link>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "Nav",
    props:{
      navList: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped lang="less">
  .nav{
    display: flex;
    align-items: center;
    height: 60px;
    background: rgba(0,123,255,.8);
    padding: 0 20px;
    .logo{
      width: 120px;
      object-fit: contain;
    }
    .nav_list{
      margin-left: 30px;
      display: flex;
      align-items: center;
      height: 100%;
      &:hover{
        .nav_btn:not(:hover){
          color: rgba(255,255,255,.5);
        }
      }
      .nav_btn{
        height: 100%;
        padding: 0 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all .3s;
        font-size: 16px;
        color: rgba(255,255,255,.5);
        &.router-link-exact-active{
          background: rgba(0,123,255,1);
          color: rgba(255,255,255,1) !important;
        }
        &:hover{
          background: rgba(0,123,255,1);
        }
        &:not(:last-child){
          margin-right: 20px;
        }
      }
    }
  }
</style>