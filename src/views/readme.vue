<template>
  <div>
    <markdown-preview :initialValue="markDown"></markdown-preview>
  </div>
</template>

<script>
  import { MarkdownPreview } from 'vue-meditor'
  export default {
    name: "readme",
    components:{
      MarkdownPreview
    },
    data(){
      return {
        markDown: ''
      }
    },
    methods:{
      getMdData(){
        this.$axios.get('http://192.168.0.212:8081/README.md')
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