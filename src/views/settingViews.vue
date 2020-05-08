<template>
  <div class="setting_views">
    <el-card class="logs_card" shadow="hover">
      <div slot="header" class="card_header">
        <span>配置详情</span>
        <div style="float: right">
          <el-button v-if="showEditBtn" style="padding: 9px 30px;" type="primary" @click="editProjectBtn()">编辑项目显示</el-button>
          <el-button-group v-else>
            <el-button @click="submitEditProject('save')" type="primary">保存</el-button>
            <el-button @click="submitEditProject('close')">取消</el-button>
          </el-button-group>
          <el-button v-if="!showEditBtn" type="primary" style="margin-left: 10px" @click="checkedAllProject">开/关所有项目</el-button>
          <el-button style="padding: 9px 30px;margin-left: 10px" type="primary" @click="openSettingBtn('add')">添加</el-button>
        </div>
        </div>

      <el-table
        :data="settingData"
        border
        stripe
        ref="settingTable"
        @row-dblclick="dbClickOpenData"
        highlight-current-row
        height="calc(100vh - 200px)"
        row-key="project"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :row-class-name="tableRowClassName"
        style="width: 100%;min-height: 400px">
        <el-table-column
          prop="project"
          show-overflow-tooltip
          width="280"
          label="项目名称">
        </el-table-column>
        <el-table-column
          prop="unit"
          show-overflow-tooltip
          align="center"
          width="70"
          label="存储周期">
          <template slot-scope="scope">
            {{scope.row.type !== 'menu'?scope.row.number + scope.row.unit: ''}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="100"
          prop="max_alarm_num"
          label="报警阀值">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="extra_field"
          min-width="200"
          label="扩展字段">
        </el-table-column>
        <el-table-column
          align="center"
          width="70"
          label="是否显示">
          <template slot-scope="scope">
            <el-switch
              :disabled="showEditBtn"
              @change="switchShowType(scope.row,$event)"
              :style="{'left': scope.row.type === 'menu'?'-12px': 0}"
              v-model="scope.row.status"
              active-color="rgba(0, 123, 255, 0.8)"
              inactive-color="#909399">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="45"
          align="center"
          label="钉钉">
          <template slot-scope="scope">
            <div v-if="scope.row.message_way && scope.row.type !== 'menu'? scope.row.message_way.indexOf('DD') !== -1:false">
              <svg t="1588749534216" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="16" height="16"><path d="M896 0 128 0C57.344 0 0 57.344 0 128l0 768c0 70.656 57.344 128 128 128l768 0c70.656 0 128-57.344 128-128L1024 128C1024 57.344 966.656 0 896 0zM960 896c0 35.392-28.608 64-64 64L128 960c-35.328 0-64-28.608-64-64L64 128c0-35.328 28.672-64 64-64l768 0c35.392 0 64 28.672 64 64L960 896zM421.568 783.552 149.952 512 240.512 421.44 421.504 602.496 783.552 240.448 874.048 331.008Z" p-id="1998" fill="#8a8a8a"></path></svg>
            </div>
            <div v-else-if="scope.row.type !== 'menu'">
              <svg t="1588749493551" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1444" width="16" height="16"><path d="M921.6 51.2c28.2368 0 51.2 22.9632 51.2 51.2l0 819.2c0 28.2368-22.9632 51.2-51.2 51.2L102.4 972.8c-28.2368 0-51.2-22.9632-51.2-51.2L51.2 102.4c0-28.2368 22.9632-51.2 51.2-51.2L921.6 51.2M921.6 0 102.4 0C45.8496 0 0 45.8496 0 102.4l0 819.2c0 56.5504 45.8496 102.4 102.4 102.4l819.2 0c56.5504 0 102.4-45.8496 102.4-102.4L1024 102.4C1024 45.8496 978.1504 0 921.6 0L921.6 0z" p-id="1445" fill="#8a8a8a"></path></svg>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="45"
          align="center"
          label="短信">
          <template slot-scope="scope">
            <div v-if="scope.row.message_way && scope.row.type !== 'menu'? scope.row.message_way.indexOf('SMS') !== -1:false">
              <svg t="1588749534216" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="16" height="16"><path d="M896 0 128 0C57.344 0 0 57.344 0 128l0 768c0 70.656 57.344 128 128 128l768 0c70.656 0 128-57.344 128-128L1024 128C1024 57.344 966.656 0 896 0zM960 896c0 35.392-28.608 64-64 64L128 960c-35.328 0-64-28.608-64-64L64 128c0-35.328 28.672-64 64-64l768 0c35.392 0 64 28.672 64 64L960 896zM421.568 783.552 149.952 512 240.512 421.44 421.504 602.496 783.552 240.448 874.048 331.008Z" p-id="1998" fill="#8a8a8a"></path></svg>
            </div>
            <div v-else-if="scope.row.type !== 'menu'">
              <svg t="1588749493551" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1444" width="16" height="16"><path d="M921.6 51.2c28.2368 0 51.2 22.9632 51.2 51.2l0 819.2c0 28.2368-22.9632 51.2-51.2 51.2L102.4 972.8c-28.2368 0-51.2-22.9632-51.2-51.2L51.2 102.4c0-28.2368 22.9632-51.2 51.2-51.2L921.6 51.2M921.6 0 102.4 0C45.8496 0 0 45.8496 0 102.4l0 819.2c0 56.5504 45.8496 102.4 102.4 102.4l819.2 0c56.5504 0 102.4-45.8496 102.4-102.4L1024 102.4C1024 45.8496 978.1504 0 921.6 0L921.6 0z" p-id="1445" fill="#8a8a8a"></path></svg>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="phone_no"
          width="120"
          label="手机">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="job_no"
          width="75"
          label="工号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="author"
          width="75"
          label="作者">
        </el-table-column>
        <el-table-column
          width="80"
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.type !== 'menu'" type="primary" size="mini" @click="openSettingBtn('edit',scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <el-dialog
      :title="settingType === 'add' ?'添加配置':'修改配置'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="settingDialog"
      width="500px">
      <el-form label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="settingForm.project" clearable placeholder="不能包含“_”, 长度建议不能超过50byte"></el-input>
        </el-form-item>
        <el-form-item label="项目模块" v-if="settingType === 'add'">
          <el-input v-model="settingForm.module" clearable placeholder="不能包含“_”, 长度建议不能超过50byte"></el-input>
        </el-form-item>
        <el-form-item label="单位" v-if="settingType === 'add'">
          <el-select style="width: 100%;" clearable v-model="settingForm.unit" placeholder="请选择单位">
            <el-option label="d（天）" value="d"></el-option>
            <el-option label="w（周）" value="w"></el-option>
            <el-option label="m（月）" value="m"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" v-if="settingType === 'add'">
          <el-input v-model="settingForm.number" clearable placeholder="单位个数，如：2天为周期，单位：d， 数量： 2"></el-input>
        </el-form-item>
        <el-form-item label="最大报警数量">
          <el-input v-model="settingForm.max_alarm_num" clearable placeholder="error + fatal 达到该向钉钉发消息"></el-input>
        </el-form-item>
        <el-form-item label="扩展字段">
          <el-input v-model="settingForm.extra_field" clearable placeholder="扩展字段, 传入 如: 订单号^PNR, 最多5个"></el-input>
        </el-form-item>
        <el-form-item label="发送信息方式">
          <el-checkbox-group v-model="settingForm.message_way">
            <el-checkbox label="DD">钉钉</el-checkbox>
            <el-checkbox label="SMS">短信</el-checkbox>
          </el-checkbox-group>

<!--          <el-input v-model="settingForm.message_way" clearable placeholder="发送消息方式，DD:钉钉， SMS:短信"></el-input>-->
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="settingForm.phone_no" clearable placeholder="手机号，用于发送短信, 选择短信时为必填"></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="settingForm.job_no" clearable placeholder="工号"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="settingForm.author" clearable placeholder="数据创建人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSettingData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "settingViews",
    data(){
      return {
        settingData: [],  // 配置详情数据
        settingDialog: false, // 配置弹窗
        settingType: '', // 配置弹窗类型

        settingForm: {
          message_way: []
        }, // 配置对象数据

        clickTableName: ['占位符'], // 双击展开列表

        username: '', // 用户名
        showEditBtn: true, // 编辑项目按钮状态
        userProjects: [],  // 用户项目列表

        allProjectStatus: false, // 所有项目状态
        allProjectLength: 0,  // 所有项目数量
      }
    },
    methods:{
      /**
       * @Description: 获取配置详情数据
       * @author Wish
       * @date 2020/3/24
      */
      getSettingData(){
        this.$axios.get('http://192.168.0.176:8081/log/queryList/log/settings')
          .then(res =>{
            if(res.data.code === 0){
              let settingData =  res.data.message
              this.allProjectLength = settingData.length
              if(settingData.length> 0){
                const listArr = [];

                settingData.forEach((el,index) =>{
                  // console.log(el);
                  this.userProjects.forEach(item =>{
                    if(item === el.project){
                      el['status'] = true
                    }
                  })
                  for(let i=0; i<listArr.length; i++){
                    if(listArr[i].project === el.project.split("_")[0]){

                      listArr[i].children.push(el);
                      return;
                    }
                  }
                  listArr.push({
                    project: el.project.split("_")[0],
                    ID: index + '_' +el.project.split("_")[0],
                    type: 'menu',
                    children: [el],
                    status: false
                  });
                });
                listArr.forEach(item =>{
                  // item.children.forEach()
                  item.project = item.project + ' ('+item.children.length + ')'
                })
                this.settingData = listArr
                // console.log(this.settingData);
              }
            }else {
              this.$message.warning(res.message)
            }
          })
        .catch(e =>{
          this.$message.error('请求错误')
        })
      },

      /**
       * @Description: 双击table行
       * @author Wish
       * @date 2020/4/23
       */
      dbClickOpenData(row, column, event){
        this.clickTableName.forEach((item,index) =>{
          if(item === row.ID){
            this.$refs.settingTable.toggleRowExpansion(row, false)
            this.clickTableName.splice(index)
          }else {
            this.$refs.settingTable.toggleRowExpansion(row, true)
            this.clickTableName.push(row.ID)
          }
        })
      },

      /**
       * @Description: 打开新增or编辑弹窗
       * @author Wish
       * @date 2020/3/24
      */
      openSettingBtn(type,val){
        console.log(type, val);
        this.settingType = type
        this.settingDialog = true
        if(type !== 'add'){
          val.message_way = val.message_way instanceof Array?val.message_way:val.message_way.split(",")
          this.settingForm = JSON.parse(JSON.stringify(val))
        }else {
          this.settingForm = {
            message_way: []
          }
        }

      },

      /**
       * @Description: 保存按钮
       * @author Wish
       * @date 2020/3/24
      */
      saveSettingData(){
        let data
        if(this.settingForm.message_way.length > 1){
          for(let i = 0; i < this.settingForm.message_way.length; i++) {
            if(this.settingForm.message_way[i] === 'SMS' && !this.settingForm.phone_no){
              return this.$message.warning('手机号码必填')
            }
          }
        }
        if(this.settingType === 'add'){
          data = JSON.parse(JSON.stringify(this.settingForm))
          data['max_alarm_num'] = Number(this.settingForm.max_alarm_num)
          data['number'] = Number(this.settingForm.number)
          data['message_way'] = String(this.settingForm.message_way)
        }else {
          data = {
            project: this.settingForm.project,
            number: Number(this.settingForm.max_alarm_num),
            author: this.settingForm.author,
            job_no: this.settingForm.job_no,
            message_way: String(this.settingForm.message_way),
            phone_no: this.settingForm.phone_no,
            extra_field: this.settingForm.extra_field,
            max_alarm_num: Number(this.settingForm.max_alarm_num)
          }
        }
        let url = this.settingType === 'add'? 'http://192.168.0.176:8081/settings/set': 'http://192.168.0.176:8081/settings/alarm'
        this.$axios.post(url,data)
          .then(res =>{
            if(res.data.code === 0){
              this.$message.success(res.data.message)
              this.settingDialog = false
              this.getSettingData()
            }else {
              this.$message.warning(res.data.message)
            }
          })
          .catch(e =>{
            this.$message.error('请求错误')
          })
      },


      /**
       * @Description: 开启项目编辑
       * @author Wish
       * @date 2020/5/6
      */
      editProjectBtn(){
        this.showEditBtn = false
      },

      /**
       * @Description: 保存或取消项目编辑
       * @author Wish
       * @date 2020/5/6
      */
      submitEditProject(type){
        if(type === 'close'){
          this.showEditBtn = true
          this.getUserProjects()
          this.getSettingData()
        }else {
          let data = {
            project_list: this.userProjects,
            username: this.username
          }
          this.$axios.post('http://192.168.0.176:8081/user/addProjects',data)
            .then(res =>{
              if(res.data.code === 0){
                this.showEditBtn = true
              }
              this.$message.success(res.data.message)
            })
        }
      },


      /**
       * @Description: 开/关所有项目
       * @author Wish
       * @date 2020/5/7
      */
      checkedAllProject(){
        let that = this
        let newDataLength = JSON.parse(JSON.stringify(that.userProjects.length))
        this.settingData.forEach(item =>{
          item.children.forEach(oitem =>{
            if(that.allProjectLength === newDataLength){
              that.userProjects = []
              oitem.status = false
              item.status = false
            }else {
              oitem.status = true
              item.status = true
              that.userProjects.push(oitem.project)
            }
          })
        })
        that.userProjects = [...new Set(that.userProjects)]
      },


      /**
       * @Description: 切换数据开关
       * @author Wish
       * @date 2020/5/6
      */
      switchShowType(val,data){
        console.log(val,data);

        this.$forceUpdate()
        // 子级列表
        if(val.status && val.type !== 'menu'){
          this.userProjects.push(val.project)
        }else if(val.type !== 'menu') {
          this.userProjects.splice(this.userProjects.findIndex(item => item === val.project), 1)
          this.settingData.forEach(item =>{
            item.children.forEach(oitem =>{
              if(oitem.project === val.project){
                item.status = false
              }
            })
          })
        }

        // 父级
        if(val.status && val.type === 'menu'){
          this.settingData.forEach(res => res.status = res.ID === val.ID )
          val.children.forEach(res =>{
            res.status = true
            this.userProjects.push(res.project)
          })

          this.userProjects = [...new Set(this.userProjects)]
          console.log('添加');
        }else if(val.type === 'menu'){
          val.children.forEach(res =>{
            res.status = false
            this.userProjects.splice(this.userProjects.findIndex(item => item === res.project), 1)
          })
          console.log('删除');
        }
        console.log(this.userProjects);
      },


      /**
       * @Description: 配置table行属性
       * @author Wish
       * @date 2020/5/7
      */
      tableRowClassName({row, rowIndex}) {
        if(!row.status && !row.type){
          return 'close-row';
        }
        let childrenList = []
        if (row.type === 'menu') {
          row.children.map(res =>{
            if(res.status){
              childrenList.push(res.project)
            }
          })
          if(row.children.length === childrenList.length){
            row['status'] =  true
          }
          if (childrenList.length < 1){
            return 'close-row';
          }
        }
        // else if (rowIndex === 3) {
        //   return 'success-row';
        // }
        return '';
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
        this.$axios.post('http://192.168.0.176:8081/user/getProjects',data)
          .then(res =>{
            if(res.data.code === 0){
              this.userProjects = res.data.message
            }else {
              this.$message.warning(res.data.message)
            }
          })
      },
    },
    created() {
      this.username = JSON.parse(localStorage.getItem('login')).username
      this.getUserProjects()

      this.getSettingData()
    }
  }
</script>

<style scoped lang="less">
  .setting_views{

  }
  /deep/.el-table{
    .close-row{
      opacity: .5;
    }
  }
  /deep/.el-dialog__body{
    padding-bottom: unset;
  }
  /deep/.el-dialog__wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog{
      margin: unset !important;
    }
  }
</style>