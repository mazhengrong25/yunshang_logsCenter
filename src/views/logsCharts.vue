<template>
  <div class="logs_charts">
    <div class="search_header" ref="searchHeader">
      <div class="search_box search_project">
        <el-select
          style="min-width: 300px"
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
        <el-button type="primary" @click="getChartsData()">搜索</el-button>
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
        projectData: [], // 项目名称列表
        // 搜索数据
        project: [],  // 项目名称
        searchTime: [], // 搜索时间

        searchHeaderHeight: 32, // 搜索框高度

        chartsData: [], // 图表数据
        chartsType: 'line', // 图表类型 line折线图 bar柱状图
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
        if(this.project.indexOf('全部渠道') > -1){
          this.project = this.projectData
        }
        if(!this.searchTime || this.searchTime.length < 1){
          return this.$message.warning('请选择时间区间')
        }else {
          data['startTime'] = this.searchTime[0] + 'T00:00:00.000Z'
          data['endTime'] = this.searchTime[1] + 'T23:59:59.000Z'
        }
        // echarts.init(document.getElementById('myChart')).dispose();

        this.$axios.post('/statistics/successRate',data)
          .then(res =>{
            if(res.data.code === 0){
              this.chartsData = res.data.data
              setTimeout(() =>{
                this.echartsOption()
              },1000)
            }
          })
      },

      /**
       * @Description: Echarts配置
       * @author Wish
       * @date 2020/4/26
      */
      echartsOption() {
        let myChart = echarts.init(document.getElementById('myChart'))

        let series = []; // 图表数据处理
        let xAxisData = []; // X轴数据列表
        let chartLegendData = [];  // 图表数据开关
        let seriesData = []; // 图表data
        let seriesName = []; // 图表data名称

        this.chartsData.forEach((item ,index) =>{
          console.log(item);
          item.Modules.forEach((oItem, oIndex) =>{
            chartLegendData.push(oItem.ModuleName.split('T')[0])
            oItem.Data.forEach((pItem, pIndex) =>{
              seriesData[pIndex] = []
              for (let key in pItem.Nums){
                seriesName.push(key)
                seriesData[pIndex].push(pItem.Nums[key])
              }
              xAxisData.push(pItem.Date)
            })
          })
        })
        seriesName = [...new Set(seriesName)]
        seriesName.forEach((item, index) =>{
          series.push({
            smooth: true,
            type: 'line',
            name: item,
            data: seriesData[index]
          })
        })
        console.log(chartLegendData);
        console.log(series);
        // 基于准备好的dom，初始化echarts实例
        // 绘制图表
        myChart.setOption({
          color: ['#F25645','#72C272','#F2AB45'],
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: this.chartsData.length === 1? this.chartsData[0].Project: ''
          },
          legend: {
            data: chartLegendData,
            orient: 'horizontal',
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）

          },
          grid: {  // 图表属性
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataZoom: [{  // 缩放
            id: 'dataZoomX',
            type:"inside",
            xAxisIndex: [0],
            filterMode: 'filter'
          }],
          toolbox: {  // 控制条
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex:"none"
              },
              saveAsImage: {},
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
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