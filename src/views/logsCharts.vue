<template>
  <div class="logs_charts">
    <div class="search_header" ref="searchHeader">
      <div class="search_box search_project">
        <el-select
          style="min-width: 300px"
          @change="getModalList(project)"
          v-model="project"
          multiple
          clearable
          :popper-append-to-body="false"
          placeholder="请选择项目">
          <el-option-group label="勾选全部">
            <el-option label="全部渠道" value="全部渠道"></el-option>
          </el-option-group>
          <el-option-group label="项目列表">
            <el-option
              v-for="(item ,index) in projectData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-option-group>
        </el-select>
      </div>
<!--      <div class="search_box search_project">-->
<!--        <el-select-->
<!--          style="min-width: 300px"-->
<!--          v-model="module"-->
<!--          :disabled="project.length > 1 || project.indexOf('全部渠道') !== -1 || modalList.length < 1"-->
<!--          multiple-->
<!--          clearable-->
<!--          :popper-append-to-body="false"-->
<!--          placeholder="请选择模块">-->
<!--          <el-option-group label="勾选全部">-->
<!--            <el-option label="全部模块" value="全部模块"></el-option>-->
<!--          </el-option-group>-->
<!--          <el-option-group label="模块列表">-->
<!--            <el-option-->
<!--              v-for="(item ,index) in modalList"-->
<!--              :key="index"-->
<!--              :label="item.text"-->
<!--              :value="item.id"-->
<!--            ></el-option>-->
<!--          </el-option-group>-->
<!--        </el-select>-->
<!--      </div>-->
      <div class="search_box">
        <el-date-picker
          v-model="searchTime"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="search_box">
        <el-button type="primary" @click="getChartsData()" v-loading="loading" :disabled="loading">搜索</el-button>
      </div>
    </div>

    <el-card class="charts_main"
             v-if="chartsData.length > 0"
             shadow="hover"
             :style="'height: calc(100vh - '+searchHeaderHeight+'px - 125px)'">
      <div id="myChart" :style="'height: calc(100vh - '+searchHeaderHeight+'px - 165px)'"></div>
    </el-card>
    <div class="prompt" v-else>暂无图表数据</div>

  </div>
</template>

<script>
  let echarts = require("echarts/lib/echarts");
  // 引入组件
  require("echarts/lib/chart/line");
  require("echarts/lib/chart/bar");
  // 引入提示框和title组件
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  require("echarts/lib/component/dataZoom");
  require("echarts/lib/component/legend");
  require("echarts/lib/component/toolbox");
  require("echarts/lib/component/axisPointer");
  export default {
    name: "logsCharts",
    data(){
      return {
        loading: false, // 加载
        projectData: [], // 项目名称列表
        modalList: [], // 项目模块列表
        // 搜索数据
        project: [],  // 项目名称
        module: [], // 模块名称
        searchTime: [], // 搜索时间

        searchHeaderHeight: 32, // 搜索框高度

        chartsData: [], // 图表数据
        chartsType: 'bar', // 图表类型 line折线图 bar柱状图
      }
    },
    methods: {
      /**
       * @Description: 获取图表数据
       * @author Wish
       * @date 2020/4/26
      */
      getChartsData(){
        this.searchHeaderHeight = this.$refs.searchHeader.clientHeight
        let data = {}
        if(this.project.length < 1){
          return this.$message.warning('请选择项目名称')
        }else {
          data['project'] = this.project
        }
        /**
        if(this.project.indexOf('全部渠道') > -1){
          this.project = this.projectData
        }
        if(this.module.length > 0 && this.module.indexOf('全部模块') === -1){
          data['module'] = this.module
        }
        if(this.module.length < 1 || this.module.indexOf('全部模块') > -1){
          this.module = []
          this.modalList.map(item =>{
            this.module.push(item.text)
          })
          data['module'] = this.module
        }
         */

        if(!this.searchTime || this.searchTime.length < 1){
          return this.$message.warning('请选择时间区间')
        }else {
          data['startTime'] = this.searchTime[0] + 'T00:00:00.000Z'
          data['endTime'] = this.searchTime[1] + 'T23:59:59.000Z'
        }
        this.loading = true
        // echarts.init(document.getElementById('myChart')).dispose();
        // console.log(data);
        this.$axios.post('/statistics/successRate',data)
          .then(res =>{
            if(res.data.code === 0){
              this.chartsData = res.data.data
              setTimeout(() =>{
                this.echartsOption()
              },1000)
            }else {
              this.loading = false
            }
          })
        .catch(() =>{
          this.loading = false
        })
      },

      /**
       * @Description: 获取模块列表
       * @author Wish
       * @date 2020/3/20
       */
      getModalList(val) {
        /***
        if(val.length === 1){
          this.modalList = [];
          this.module = [];
          this.$axios.get('/log/queryList/' + String(val))
            .then(res => {
              if (res.data.code === 0) {
                let modalList = res.data.message;
                for (let i = 0; i < modalList.length; i++) {
                  let option = {
                    "id": modalList[i].split('_')[0] + '_' + modalList[i].split('_')[1],
                    "text": modalList[i].split('_')[1],
                  };
                  this.modalList.push(option)
                }
                console.log(this.modalList);
                const obj = {};
                this.modalList = this.modalList.reduce(function (item, next) {
                  obj[next.text] ? '' : obj[next.text] = true && item.push(next);
                  return item;
                }, []);
                console.log(this.modalList);
              } else {
                this.$message.warning(res.data.message)
              }
            })
        }else {
          this.module = []
          this.modalList = []
        }
         */
      },

      /**
       * @Description: Echarts配置
       * @author Wish
       * @date 2020/4/26
      */
      echartsOption() {

        let xAxisData = this.$timeSupplement(this.searchTime[0],this.searchTime[1]); // X轴数据列表

        let series = []; // 图表数据处理
        let chartLegendData = [];  // 图表数据开关
        let seriesData = []; // 图表data
        let seriesName = []; // 图表data名称

        let error = []
        let fatal = []
        let info = []
        let warn = []
        if(this.chartsData.length === 1){
          if(this.chartsData[0].Modules.length === 1){
            this.chartsType = 'line'
          }else {
            this.chartsType = 'bar'
          }
        }else {
          this.chartsType = 'bar'
        }

        this.chartsData.forEach((item ,index) =>{

          console.log('根数据',item);
          /**
           * @Description: 数组数据处理
           * @author Wish
           * @date 2020/4/28
          */
          console.log('模块数据',item.Modules);

          /**
           * @Description: 模块数据处理
           * @author Wish
           * @date 2020/4/28
          */
          item.Modules.forEach((aItem, aIndex) =>{
            console.log('模块名称',aItem.ModuleName);
            seriesName.push(aItem.ModuleName)
            console.log('选中日数据列表',aItem);
            error.push(aItem.TotalError || 0)
            fatal.push(aItem.TotalFatal || 0)
            info.push(aItem.TotalInfo || 0)
            warn.push(aItem.TotalWarn || 0)
          })

          seriesName.forEach((item, index) =>{
            series = [{
              name: 'error',
              type: 'bar',
              stack: item,
              data: error,
              title: item.Project
            },{
              name: 'fatal',
              type: 'bar',
              stack: item,
              data: fatal,
              title: item.Project
            },{
              name: 'info',
              type: 'bar',
              stack: item,
              data: info,
              title: item.Project
            },{
              name: 'warn',
              type: 'bar',
              stack: item,
              data: warn,
              title: item.Project
            }]
          })

          /**
          this.chartsType = item.Modules.length === 1? 'line': 'bar'
          item.Modules.forEach((oItem, oIndex) =>{
            chartLegendData.push(oItem.ModuleName)

            xAxisData.forEach((lItem,lIndex) =>{
              oItem.Data.forEach((pItem, pIndex) =>{
                seriesData[lIndex] = []
                for (let key in pItem.Nums){
                  seriesName.push(key)
                  if(String(pItem.Date.split('T',1)) === lItem){
                    seriesData[lIndex].push(pItem.Nums[key])
                  }else {
                    seriesData[lIndex].push(0)
                  }
                }
              })
              series.push({
                smooth: true,
                type: this.chartsType,
                name: seriesName[lIndex],
                stack: oItem.ModuleName,
                data: seriesData[lIndex],
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return '';
                    }
                  },
                },
              })

            })

          })
          */
        })




        // console.log(xAxisData);
        // console.log(seriesName);
        // console.log(chartLegendData);
        // console.log(series);
        console.log('chartData数据',series);
        // 基于准备好的dom，初始化echarts实例
        // 绘制图表
        this.loading = false
        let myChart = echarts.init(document.getElementById('myChart'))

        myChart.setOption({
          color: ['#F56C6C','#67C23A','#909399','#E6A23C'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data) {
              // console.log(data);
              let number = 0
              data.map(item =>{
                number += item.data
              })
              // console.log(number);
              let res = data[0].data?data[0].marker+ ' '+data[0].seriesName+'：' + data[0].data + ' <span style="font-size: 12px;margin-left: 10px">(占比：'+ (Math.round(data[0].data / number * 10000) / 100.00).toFixed(1)+ '%)</span>' + '<br />':'';
              for(let i=1; i< data.length; i++){
                res += data[i].data?data[i].marker+ ' '+ data[i].seriesName+'：'+data[i].data + ' <span style="font-size: 12px;margin-left: 10px">(占比：'+ (Math.round(data[i].data / number * 10000) / 100.00).toFixed(1)+ '%)</span>' + '<br />': ''
              }
              return res;
            },
          },
          title: {
            text: this.chartsData.length === 1? this.chartsData[0].Project: ''
          },
          legend: {
            data: ['error','fatal','info','warn'],
            orient: 'horizontal',
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）

          },
          grid: {  // 图表属性
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          // dataZoom: [{  // 缩放
          //   id: 'dataZoomX',
          //   xAxisIndex: [0],
          //   type: 'slider',
          //   filterMode: 'filter',
          // }],
          toolbox: {  // 控制条
            show: true,
            feature: {
              saveAsImage: {},
            }
          },
          xAxis: {
            type: 'category',
            // boundaryGap: false,
            data: seriesName
          },
          yAxis: {
            type: 'value'
          },
          series: series,
        });
      },


      /**
       * @Description: 获取项目列表
       * @author Wish
       * @date 2020/4/26
      */
      getProjectData(){
        this.$axios.get('/log/queryList')
          .then(res =>{
            if(res.data.code === 0){
              this.projectData = res.data.message
            }
          })
      },
    },
    mounted() {
      // console.log(this.$timeSupplement(new Date('2020-03-20'), new Date('2020-05-10')));
    },
    created() {
      this.getProjectData()
    },
  }
</script>

<style scoped lang="less">
  .logs_charts{
    height: 100%;
    position: relative;
    .prompt{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      text-shadow: 0 2px white;
      font-size: 1.5rem;
      font-weight: bold;
      color: #b8bec5;
      min-height: 100px;
    }
    .search_header{
      display: flex;
      /*margin-bottom: 20px;*/
      .search_box{
        &.search_project{
          /deep/.el-select-dropdown{
            .el-scrollbar{
              .el-select-dropdown__wrap{
                max-height: 75vh;
              }
            }
          }
        }
        &:not(:last-child){
          margin-right: 10px;
        }
      }
    }
    .charts_main{
      min-height: 400px;
      margin-top: 20px;
      /deep/.el-card__body{
        height: 100%;
      }
      #myChart{
        width: 100%;
      }
    }
  }
</style>