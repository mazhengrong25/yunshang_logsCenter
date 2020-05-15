<template>
  <div class="logs_views">
    <div class="search_box">
      <div class="search_list" style="width: 200px">
        <el-select
          v-model="searchForm.project"
          size="small"
          :popper-append-to-body="false"
          placeholder="请选择项目"
          clearable
          @change="getModalList(searchForm.project)">
          <el-option
            v-for="(item,index) in objectList"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="search_list" style="width: 150px">
        <el-select
          v-model="searchForm.module"
          size="small"
          placeholder="请选择模块"
          :popper-append-to-body="false"
          clearable
          @change="getFieldList(searchForm.module)">
          <el-option
            v-for="(item,index) in modalList"
            :key="index"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="search_list" style="width: 140px">
        <el-select v-model="searchForm.level" size="small" placeholder="请选择日志级别" clearable>
          <el-option
            v-for="item in logsLevelList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="search_list" style="width: 115px">
        <el-input size="small" v-model="searchForm.user" placeholder="请输入工号" clearable></el-input>
      </div>
      <div class="search_list" style="width: 190px;">
        <el-date-picker
          size="small"
          clearable
          v-model="startTime"
          type="datetime"
          value-format="timestamp"
          placeholder="选择开始时间">
        </el-date-picker>
      </div>
      <div class="search_list" style="width: 190px;">
        <el-date-picker
          size="small"
          clearable
          type="datetime"
          value-format="timestamp"
          v-model="endTime"
          placeholder="选择结束时间">
        </el-date-picker>
      </div>
      <div class="search_list" style="width: 130px">
        <el-input size="small" v-model="searchForm.msg" placeholder="请输入关键字" clearable></el-input>
      </div>
      <div class="search_list" style="width: 240px">
        <el-input size="small" v-model="searchForm.field1" :placeholder="fieldListPlace" clearable></el-input>
      </div>
      <div class="search_list">
        <el-button size="small" type="primary" @click="searchBtn(1,15)">查询</el-button>
      </div>
    </div>

    <!--
    <el-card :class="['logs_card',{'cardPadding':showReport}]" shadow="hover">
      <div slot="header" class="card_header">
        <span>日志报告</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="showReport = !showReport">{{showReport? '收起': '展开'}}</el-button>
      </div>
      <transition name="el-fade-in-linear">
        <div class="logs_message_list" v-if="showReport">
          <el-card class="logs_message_box" shadow="hover">
            <i class="el-icon-star-off"></i>
            <div class="logs_message_text">
              <p>日志总数</p>
              <span>{{messageList.totalNums}}</span>
            </div>
          </el-card>
          <el-card class="logs_message_box" shadow="hover">
            <i class="el-icon-data-line"></i>
            <div class="logs_message_text">
              <p>查询结果</p>
              <span>{{messageNum}}</span>
            </div>
          </el-card>
          <el-card class="logs_message_box" shadow="hover">
            <i class="el-icon-magic-stick"></i>
            <div class="logs_message_text">
              <p>成功率</p>
              <span>{{messageList.successRate}}</span>
            </div>
          </el-card>
          <el-card class="logs_message_box" shadow="hover">
            <i class="el-icon-stopwatch"></i>
            <div class="logs_message_text">
              <p>查询耗时</p>
              <span>{{messageList.elapsedTime ? messageList.elapsedTime + 'ms': ''}}</span>
            </div>
          </el-card>
        </div>
      </transition>
    </el-card>
    -->
    <el-card :class="['logs_card',{'cardPadding':showTable}]" shadow="hover">
      <div slot="header" class="card_header">
        <span>日志详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="showTable = !showTable">{{showTable? '收起': '展开'}}</el-button>
      </div>
      <transition name="el-fade-in-linear">
        <el-table
          v-el-table-infinite-scroll="load"
          height="calc(100vh - 270px)"
          v-show="showTable"
          :data="logDataList"
          border
          stripe
          class="log_table"
          highlight-current-row
          style="width: 100%;min-height: 400px">
          <el-table-column
            width="140"
            show-overflow-tooltip
            label="项目名称">
            <template slot-scope="scope">
              {{scope.row.project}}
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            show-overflow-tooltip
            label="模块">
            <template slot-scope="scope">
              {{scope.row.module}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            width="70"
            label="日志等级">
            <template slot-scope="scope">
              <el-tag
                size="small"
                :type="scope.row.level === 'info' ? 'info' :
                   scope.row.level === 'error' ? 'danger':
                   scope.row.level === 'warn' ? 'warning':
                   scope.row.level === 'fatal' ? 'success': ''"
                disable-transitions>{{scope.row.level}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="user"
            width="70"
            label="工号">
          </el-table-column>
          <el-table-column
            width="160"
            show-overflow-tooltip
            label="时间">
            <template slot-scope="scope">
              {{$getTime(scope.row.time)}}
            </template>
          </el-table-column>
          <el-table-column
            min-width="300"
            label="日志详情">
            <template slot-scope="scope">
              <div class="hide_message" @click="openMessageDetails(scope.row.message)">
                <p class="message">{{scope.row.message}}</p>
<!--                <el-button size="mini" type="primary" icon="el-icon-search" circle></el-button>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="300"
            show-overflow-tooltip
            label="扩展字段">
            <template slot-scope="scope">
              <div style="cursor: pointer" @click="openFieldDialog(scope.row)">
                {{(scope.row.field1? scope.row.field1 + "^": ' ^') +
                (scope.row.field2? scope.row.field2 + "^": ' ^') +
                (scope.row.field3? scope.row.field3 + "^": ' ^') +
                (scope.row.field4? scope.row.field4 + "^": ' ^') +
                (scope.row.field5? scope.row.field5: '')
                }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </transition>
    </el-card>

    <el-dialog
      title="日志详情"
      :visible.sync="showMessageDetails"
      width="600px">
      <el-button type="text"
                 class="copyJson"
                 v-clipboard:error="onError"
                 v-clipboard:copy="messageType === 'json'?JSON.stringify(messageDetails): messageDetails"
                 v-clipboard:success="onCopy">复制</el-button>
      <json-view v-if="messageType === 'json'" style="max-height: 500px;overflow-y: auto" :json="messageType === 'json'?messageDetails:'{}'"></json-view>
      <p v-else style="max-height: 500px;overflow-y: auto">{{messageDetails}}</p>
    </el-dialog>

    <el-dialog
      title="扩展字段详情"
      :visible.sync="showFieldDetails"
      width="400px">
      <el-checkbox-group
        v-model="fieldDetailsList"
        class="field_box">
          <div class="field_list">
            <p>{{fieldDetailsName[0]? fieldDetailsName[0] : 'field1'}}：</p>
            <!--          <span>{{fieldDetails.field1}}</span>-->
            <el-checkbox @change="checkedFieldList(fieldDetails.field1,0)" :label="fieldDetails.field1"></el-checkbox>

          </div>
          <div class="field_list">
            <p>{{fieldDetailsName[1]? fieldDetailsName[1] : 'field2'}}：</p>
            <!--          <span>{{// fieldDetails.field2}}</span>-->
            <el-checkbox @change="checkedFieldList(fieldDetails.field2,1)" :label="fieldDetails.field2"></el-checkbox>
          </div>
          <div class="field_list">
            <p>{{fieldDetailsName[2]? fieldDetailsName[2] : 'field3'}}：</p>
            <!--          <span>{{fieldDetails.field3}}</span>-->
            <el-checkbox @change="checkedFieldList(fieldDetails.field3,2)" :label="fieldDetails.field3"></el-checkbox>

          </div>
          <div class="field_list">
            <p>{{fieldDetailsName[3]? fieldDetailsName[3] : 'field4'}}：</p>
            <!--          <span>{{fieldDetails.field4}}</span>-->
            <el-checkbox @change="checkedFieldList(fieldDetails.field4,3)" :label="fieldDetails.field4"></el-checkbox>
          </div>
          <div class="field_list">
            <p>{{fieldDetailsName[4]? fieldDetailsName[4] : 'field5'}}：</p>
            <!--          <span>{{fieldDetails.field5}}</span>-->
            <el-checkbox @change="checkedFieldList(fieldDetails.field5,4)" :label="fieldDetails.field5"></el-checkbox>
          </div>

        </el-checkbox-group>
    </el-dialog>

  </div>
</template>

<script>
  import elTableInfiniteScroll from 'el-table-infinite-scroll';
  export default {
    name: "logsViews",
    components: {
      'JsonView': () => import('@/components/JsonView'),
      elTableInfiniteScroll
    },
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data() {
      return {
        objectList: [],  // 项目列表
        modalList: [], // 模块列表
        fieldListPlace: '请输入关键字',
        logsLevelList: ['Info', 'Error', 'Warn', 'Fatal'], // 日志级别
        startTime: new Date(new Date() - 1000 * 60 * 60 * 24),
        endTime: '',
        searchForm: {  // 搜索列表
          project: '',
          module: '',
          level: '',
          user: '',
          msg: '',
          field1: '',
        },
        logDataList: [], // 日志表格数据

        showReport: false, // 展开收起日志报告

        showTable: true, // 展开收起日志详情

        showMessageDetails: false, // 日志详情弹窗
        messageDetails: '', // 日志详情

        treeView: {
          maxDepth: 2,
          rootObjectKey: "日志详情JSON",
          modifiable: false,
          link: false,
          limitRenderDepth: false
        },

        messageType: '', // 日志详情类型

        dataPage: 1,
        dataNum: 15,
        scrollStatus: false,
        messageList: {}, // 日志报告信息

        messageNum: '',

        showFieldDetails: false, // 扩展字段详情弹窗
        fieldDetailsName: [], // 扩展字段名称
        fieldDetails: {}, // 扩展字段详情

        username: '', // 用户名
        userProjects: [], // 用户项目列表

        fieldDetailsList: [],  // 选中关键字列表
        fieldDetailsData: [],  // 选中关键字列表处理
      }
    },
    watch:{
      /**
       * @Description: 监听搜索框起始时间
       * @author Wish
       * @date 2020/4/14
      */
      startTime(val,oval){
        this.startTime = this.startTime? this.startTime: new Date(new Date() - 1000 * 60 * 60 * 24)
      }
    },
    methods: {
      /**
       * @Description: 起始时间重置
       * @author Wish
       * @date 2020/4/14
      */
      load() {
        if (this.scrollStatus) {
          this.dataPage = this.dataPage + 1
          this.searchForm['startTime'] = this.$getTime(new Date(this.startTime).getTime()).replace(/\s+/g, "T")
          this.searchForm['whichPage'] = this.dataPage
          this.searchForm['pageNums'] = this.dataNum
          // this.$message.success('拉取第'+this.dataPage+'页的数据');

          this.$axios.get('/log/query', {params: this.searchForm})
            .then(res => {
              if (res.data.code === 0) {
                let dataList = res.data.message
                if (dataList instanceof Array) {
                  dataList.map(item => {
                    item.project = item.project || this.searchForm.project
                    item.module = item.module || this.searchForm.module.split('_')[1]
                  })
                  this.messageNum += res.data.recordNums
                  this.messageList = res.data
                  this.logDataList = this.logDataList.concat(dataList)
                }
              } else {
                this.scrollStatus = false
                this.$message.warning(res.data.message)
              }
            })
            .catch(e => {
              this.logDataList = []
              this.$message.error('请求错误')
            })
        }
      },
      /**
       * @Description: 获取项目列表
       * @author Wish
       * @date 2020/3/20
       */
      // getProjectList() {
      //   this.$axios.get('/log/queryList')
      //     .then(res => {
      //       if (res.data.code === 0) {
      //         this.objectList = res.data.message
      //       } else {
      //         this.$message.warning(res.data.message)
      //       }
      //     })
      // },
      /**
       * @Description: 获取模块列表
       * @author Wish
       * @date 2020/3/20
       */
      getModalList(val) {
        this.modalList = [];
        this.searchForm.module = '';
        this.fieldListPlace = '请输入关键字';
        this.userProjects.forEach(item => {
          if(val === item.split('_')[0]){
            this.modalList.push({
              id: item,
              text: item.split('_')[1]
            })
          }
        })
        // this.$axios.get('/log/queryList/' + val)
        //   .then(res => {
        //     if (res.data.code === 0) {
        //       let modalList = res.data.message;
        //       for (let i = 0; i < modalList.length; i++) {
        //         let option = {
        //           "id": modalList[i].split('_')[0] + '_' + modalList[i].split('_')[1],
        //           "text": modalList[i].split('_')[1],
        //         };
        //         this.modalList.push(option)
        //       }
        //       console.log(this.modalList);
        //       const obj = {};
        //       this.modalList = this.modalList.reduce(function (item, next) {
        //         obj[next.text] ? '' : obj[next.text] = true && item.push(next);
        //         return item;
        //       }, []);
        //       console.log(this.modalList);
        //     } else {
        //       this.$message.warning(res.data.message)
        //     }
        //   })
      },
      /**
       * @Description: 获取关键字列表
       * @author Wish
       * @date 2020/3/23
       */
      getFieldList(val) {
        this.$axios.get('/log/queryList/' + this.searchForm.module + '/' + val)
          .then(res => {
            if (res.data.code === 0) {
              this.fieldListPlace = res.data.fieldName

              this.fieldDetailsName = res.data.fieldName.replace(/\s+/g, "").split('^')
              console.log(this.fieldDetailsName);
              // this.fieldList = [...new Set(fieldList.split('|'))]
              // if(this.fieldList.length <= 1 && this.fieldList[0] === ''){
              //   this.fieldListPlace = '暂无关键字列表'
              // }
            } else {
              this.$message.warning(res.data.message)
            }
          })
      },

      handleCurrentChange(val){
        console.log(val);
      },


      /**
       * @Description: 打开扩展字段弹窗
       * @author Wish
       * @date 2020/3/23
       */
      openFieldDialog(val) {
        this.fieldDetails = val
        console.log(this.fieldDetails);
        this.showFieldDetails = true
        this.fieldDetailsList = []
        this.fieldDetailsData = ['','','','','']
      },

      /**
       * @Description: 选中扩展字段
       * @author Wish
       * @date 2020/5/7
      */
      // checkedField(val,index,type){
      //   console.log(val, index, type);
      //   console.log(this.fieldDetailsList);
      // },
      checkedFieldList(val,index){
        console.log(val,index);
        if(val !== this.fieldDetailsData[index]){
          this.fieldDetailsData[index] = val
        }else {
          this.fieldDetailsData[index] = ''
        }

        // console.log(this.fieldDetailsList);
        console.log(this.fieldDetailsData);
        this.searchForm.field1 = String(this.fieldDetailsData).replace(/,/g, "^")
      },

      /**
       * @Description: 搜索按钮
       * @author Wish
       * @date 2020/3/23
       */
      searchBtn() {
        this.dataPage = 1
        this.scrollStatus = true
        this.messageList = {}
        this.logDataList = []
        console.log((new Date(this.startTime).getTime()));
        this.searchForm['startTime'] = this.$getTime(new Date(this.startTime).getTime()).replace(/\s+/g, "T")
        this.searchForm['endTime'] = this.endTime?this.$getTime(new Date(this.endTime).getTime()).replace(/\s+/g, "T"):''
        this.searchForm['whichPage'] = this.dataPage
        this.searchForm['pageNums'] = this.dataNum
        this.$axios.get('/log/query', {params: this.searchForm})
          .then(res => {
            if (res.data.code === 0) {
              let dataList = res.data.message
              this.messageNum = res.data.recordNums
              this.messageList = res.data
              console.log(dataList instanceof Array);
              if (dataList instanceof Array) {
                dataList.map(item => {
                  item.project = item.project || this.searchForm.project
                  item.module = item.module || this.searchForm.module.split('_')[1]
                })
                this.logDataList = dataList
              } else {
                this.logDataList = []
                this.$message.warning('暂无数据')
              }
            } else {
              this.logDataList = []
              this.$message.warning(res.data.message)
            }
          })
          .catch(e =>{
            this.logDataList = []
            this.$message.error('请求错误')
          })
      },

      /**
       * @Description: 日志详情弹窗框
       * @author Wish
       * @date 2020/3/23
       */
      openMessageDetails(val) {
        this.messageDetails = ''
        this.showMessageDetails = true
        try {
          if(val.indexOf('xml') !== -1) {
            this.messageDetails = val
            this.messageType = 'text'
          }else {
            if(typeof JSON.parse(val) == 'object') {
              this.messageDetails = JSON.parse(val)
              this.messageType = 'json'
            }
          }
        } catch (e) {
          this.messageDetails = val
          this.messageType = 'text'
        }
      },

      /**
       * @Description: 获取用户项目列表
       * @author Wish
       * @date 2020/5/6
       */
      getUserProjects(){
        let data = {
          username: this.username
        }
        this.$axios.post('/user/getProjects',data)
          .then(res =>{
            if(res.data.code === 0){
              this.userProjects = res.data.message
              this.userProjects.forEach(item => {
                this.objectList.push(item.split('_')[0])
              })
              this.objectList = [...new Set(this.objectList)]
              console.log(this.objectList);
              // this.userProjects = res.data.message
            }else {
              this.$message.warning(res.data.message)
            }
          })
      },


      onCopy(e) {
        this.$message({
          message: '复制成功！',
          type: 'success'
        })
      },
      // 复制失败
      onError(e) {
        this.$message({
          message: '复制失败！',
          type: 'error'
        })
      },


    },
    created() {
      this.username = JSON.parse(localStorage.getItem('login')).username
      this.getUserProjects()

      // this.getProjectList()
    }
  }
</script>

<style scoped lang="less">
  .logs_views{
    height: 100%;
    .search_box{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .search_list{
        margin-right: 10px;
        margin-bottom: 10px;
        /deep/.el-select-dropdown{
          .el-scrollbar{
            .el-select-dropdown__wrap{
              max-height: 75vh;
            }
          }
        }
        .el-date-editor{
          width: 100%;
        }
      }
    }
    .logs_message_list{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logs_message_box{
        flex: 1;
        &:not(:last-child){
          margin-right: 20px;
        }
        /deep/.el-card__body{
          height: 80px;
          min-width: 100px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 10px !important;

        }
        &:first-child{
          i>{
            background: #dc3545;
          }
        }
        &:nth-child(2){
          i>{
            background: #17a2b8;
          }
        }
        &:nth-child(3){
          i>{
            background: #28a745;
          }
        }
        &:last-child{
          i>{
            background: #ffc107;
          }
        }
        i>{
          width: 80px;
          height: 100%;
          font-size: 30px;
          font-weight: bold;
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .logs_message_text{
          display: flex;
          flex-direction: column;
          height: 100%;
          padding-top: 8px;
          width: 100%;
          p{
            /*margin-bottom: 10px;*/
          }
          span{

          }
        }
      }
    }
    .logs_card{
      &:not(:last-child){
        margin-bottom: 10px;
      }
      &.cardPadding{
        /deep/.el-card__body{
          padding: 20px;
        }
      }
      .log_table{
        /deep/.current-row{
          td{
            background: rgba(230,160,0,.2);
          }
        }
        .hide_message{
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          .message{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            /*margin-right: 20px;*/
          }
        }
      }
    }
  }
  /deep/.el-card__header{
    padding: 10px 20px;
  }
  /deep/.el-card__body{
    padding: unset;
  }
  /deep/.el-dialog__body{
    padding-top: unset;
  }
  /deep/.json-view{
    white-space: pre-wrap !important;
  }
  .field_box{
    padding-top: 25px;
    padding-left: 15px;
    font-size: 14px;
    .field_list{
      display: flex;
      align-items: center;
      >p{
        margin-right: 15px;
        min-width: 110px;
      }
      /deep/.el-checkbox{
        .el-checkbox__input{
          display: none;
        }
      }
      &:not(:last-child){
        margin-bottom: 15px;
      }
    }
  }
  .copyJson{
    position: absolute;
    top: 20px;
    left: 125px;
  }
</style>