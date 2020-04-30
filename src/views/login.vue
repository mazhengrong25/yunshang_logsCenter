<template>
  <div class="login">

    <div :class="['wrapper',{'form-success':!loginFormHide}]">
      <div class="container">
        <div class="title">
          <img class="logo" src="../assets/logo.png" alt="">
          <p>日志中心</p>
        </div>

        <transition name="el-fade-in-linear">
          <div class="login_form" v-show="loginFormHide">
            <el-input  v-model="userName" @change="userType = false" :class="['login_input',{'input_err': userType}]" type="text" placeholder="Username"></el-input>
            <el-input  v-model="password" @change="passType = false" :class="['login_input',{'input_err': passType}]" type="password" placeholder="Password"></el-input>
            <div class="login_btn_box">
              <button class="checked_btn el-icon-arrow-right" @click="showLoginBtn = !showLoginBtn"></button>
              <div class="register_box">
                <button class="login_btn" v-if="showLoginBtn" @click="loginBtn">Login</button>
                <button style="color: #67C23A" class="register_btn" @click="registerBtn">注册</button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <ul class="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>


  </div>
</template>

<script>
  export default {
    name: "login",
    data(){
      return {
        userName: '',  // 用户名
        password: '', // 密码

        loginFormHide: true, // 登录框
        userType: false, // 用户名状态
        passType: false, // 密码状态

        showLoginBtn: true, // 登录按钮
      }
    },
    methods:{
      /**
       * @Description: 页面切换按钮
       * @author Wish
       * @date 2020/4/30
      */
      checkedBtn(){
        this.showLoginBtn = !this.showLoginBtn;
      },

      /**
       * @Description: 注册
       * @author Wish
       * @date 2020/4/30
      */
      registerBtn(){},

      /**
       * @Description: 找回密码
       * @author Wish
       * @date 2020/4/30
      */
      findBackBtn(){

      },


      /**
       * @Description: 登录按钮
       * @author Wish
       * @date 2020/4/30
      */
      loginBtn(){
        if(!this.userName || !this.password){
          this.userType = !this.userName
          this.passType = !this.password
          return this.$message.warning('请输入'+ (this.userName?'密码': this.password? '用户名': '用户名和密码'))
        }else {
          let data = {
            username: this.userName,
            password: this.password
          }
          this.$axios.post('/user/login',data)
            .then(res =>{
              if(res.data.code === 0){
                if(!res.data.data){
                  // 用户名或密码不正确
                  this.$message.warning(res.data.message)
                }else {
                  // 成功获取到数据

                }
              }else {
                this.$message.warning(res.data.message)
              }
            })
          // this.loginFormHide = false
        }
      },
    },
    created() {

    }
  }
</script>

<style scoped lang="less">
  @prim: rgba(0,123,255,.8);
  .wrapper{
    background: rgba(0,123,255,.8);
    background: -webkit-linear-gradient(top left, rgba(0,123,255,.8), rgba(0,123,255,.2));
    background: -moz-linear-gradient(top left, rgba(0,123,255,.8), rgba(0,123,255,.2));
    background: -o-linear-gradient(top left, rgba(0,123,255,.8), rgba(0,123,255,.2));
    background: linear-gradient(to bottom right, rgba(0,123,255,.8), rgba(0,123,255,.2));

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    &.form-success{
      .container{
        .title{
          transform: translateY(85px);
        }
      }
    }
  }

  .container{
    min-width: 400px;
    min-height: 280px;
    text-align: center;

    .title{
      font-size: 35px;
      transition-duration: 1s;
      transition-timing-function: ease-in-put;
      font-weight: 200;
      color: #fff;
      display: inline-flex;
      align-items: center;
      /*justify-content: center;*/
      position: relative;

      >img{
        width: 165px;
        object-fit: contain;
        margin-right: 5px;
      }
      >p{
        position: relative;
        padding-left: 10px;
        &::after{
          content: '';
          position: absolute;
          display: block;
          left: 0;
          top: 0;
          height: 100%;
          background: #fff;
          width: 2px;
        }
      }
    }
  }

  .login_form{
    padding: 30px 0;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .login_input{
      width: unset;
      appearance: none;
      outline: 0;
      border: 1px solid fade(white, 40%);
      background-color: fade(white, 20%);
      border-radius: 3px;
      margin: 0 auto 10px auto;

      /deep/.el-input__inner{
        width: 300px;
        height: 100%;
        background: transparent;
        padding: 10px 15px;
        border: unset;
        text-align: center;
        color: white;
        transition-duration: 0.25s;
        font-weight: 300;
        font-size: 18px;
        transition: all .3s;
        &::placeholder {
          font-family: 'Source Sans Pro', sans-serif;
          color: white;
          font-weight: 300;
        }
        &:focus{
          background-color: white;
          width: 350px;

          color: @prim;
        }
      }

      &.input_err{
        border-color: fade(red, 40%);
      }

      &:hover{
        background-color: fade(white, 40%);
      }

    }

    .login_btn_box{
      width: 300px;
      display: flex;
      align-items: center;
      button{
        appearance: none;
        outline: 0;
        border: 0;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        cursor: pointer;
        transition-duration: 0.25s;
        color: @prim;
        background-color: white;
      }
      .checked_btn{
        width: 40px;
        margin-right: 5px;
      }
      .login_btn{
        flex: 1;
        font-size: 18px;
      }
      .register_box{
        display: flex;
        align-items: center;
        position: relative;
        flex: 1;
        transition: all .3s;
        font-size: 16px;
        .register_btn{
          flex: 1;
          &:last-child{
            margin-left: 5px;
          }
        }
      }
    }

  }

  .bg-bubbles{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    z-index: 1;

    li{
      position: absolute;
      list-style: none;
      display: block;
      width: 40px;
      height: 40px;
      background-color: fade(white, 15%);
      bottom: -160px;

      -webkit-animation: square 80s infinite;
      animation:         square 80s infinite;

      -webkit-transition-timing-function: linear;
      transition-timing-function: linear;

      &:nth-child(1){
        left: 10%;
      }

      &:nth-child(2){
        left: 20%;

        width: 80px;
        height: 80px;

        animation-delay: 2s;
        animation-duration: 17s;
      }

      &:nth-child(3){
        left: 25%;
        animation-delay: 4s;
      }

      &:nth-child(4){
        left: 40%;
        width: 60px;
        height: 60px;

        animation-duration: 22s;

        background-color: fade(white, 25%);
      }

      &:nth-child(5){
        left: 70%;
      }

      &:nth-child(6){
        left: 80%;
        width: 120px;
        height: 120px;

        animation-delay: 3s;
        background-color: fade(white, 20%);
      }

      &:nth-child(7){
        left: 32%;
        width: 160px;
        height: 160px;

        animation-delay: 7s;
      }

      &:nth-child(8){
        left: 55%;
        width: 20px;
        height: 20px;

        animation-delay: 15s;
        animation-duration: 40s;
      }

      &:nth-child(9){
        left: 25%;
        width: 10px;
        height: 10px;

        animation-delay: 2s;
        animation-duration: 40s;
        background-color: fade(white, 30%);
      }

      &:nth-child(10){
        left: 90%;
        width: 160px;
        height: 160px;

        animation-delay: 11s;
      }
    }
  }

  @-webkit-keyframes square {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-2000) rotate(600deg); }
  }
  @keyframes square {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-2000px) rotate(600deg); }
  }
</style>