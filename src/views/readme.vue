<template>
  <div>
    <markdown-preview :initialValue="markDown"></markdown-preview>


    <div  style="white-space:pre-wrap;" v-html="dataList"></div>
    <div style="white-space:pre-wrap;" >{{dataList}}</div>
  </div>
</template>

<script>
  import { MarkdownPreview } from 'vue-meditor'
  export default {
    name: "readme",
    components:{
      MarkdownPreview,
    },
    data(){
      return {
        markDown: '',
        dataList: '{"异常类型"："IndexOutOf \nRangeException","异常消息"：\r "索引超出了数组界限。",\n"异常信息"：" 在 ETermDataService.Test.Page_Load(Object sender, EventArgs e) 位置 E: \n Works2019 zjh ETermDataService ETermDataService ETermDataService Test.aspx.cs:行号 22"}'
      }
    },
    methods:{
      getMdData(){
        this.$axios.get('/README.md')
          .then(res =>{
            this.markDown = res.data
          })
      },
    },
    created() {
      this.getMdData()
    }
  }
</script>

<style scoped lang="less">

</style>