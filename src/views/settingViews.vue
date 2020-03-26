<template>
  <div class="setting_views">
    <el-card class="logs_card" shadow="hover">
      <div slot="header" class="card_header">
        <span>配置详情</span>
        <el-button style="float: right;padding: 9px 30px;" type="primary" @click="openSettingBtn('add')">添加</el-button>
      </div>

      <el-table
        :data="settingData"
        border

        height="calc(100vh - 260px)"
        row-key="project"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
          width="50"
          label="单位">
        </el-table-column>
        <el-table-column
          prop="number"
          show-overflow-tooltip
          align="center"
          width="50"
          label="数量">
        </el-table-column>
        <el-table-column
          min-width="300"
          show-overflow-tooltip
          prop="NewCollectionName"
          label="当前集合名">
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
            <el-button v-if="scope.row.type !== 'menu'" size="mini" @click="openSettingBtn('edit',scope.row)">编辑</el-button>
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
        <el-form-item label="扩展字段" v-if="settingType === 'add'">
          <el-input v-model="settingForm.extra_field" clearable placeholder="禁止使用中文状态下“｜” 分隔"></el-input>
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

        settingForm: {}, // 配置对象数据
      }
    },
    methods:{
      /**
       * @Description: 获取配置详情数据
       * @author Wish
       * @date 2020/3/24
      */
      getSettingData(){
        this.$axios.get('http://192.168.0.212:8081/log/queryList/log/settings')
          .then(res =>{
            if(res.data.code === 0){
              let settingData =  res.data.message
              if(settingData.length> 0){
                const listArr = [];
                settingData.forEach((el,index) =>{
                  for(let i=0; i<listArr.length; i++){
                    if(listArr[i].project === el.project.split("_")[0]){
                      listArr[i].children.push(el);
                      return;
                    }
                  }
                  listArr.push({
                    project: el.project.split("_")[0],
                    type: 'menu',
                    children: [el]
                  });
                });
                listArr.forEach(res =>{
                  res.project = res.project + ' ('+res.children.length + ')'
                })
                this.settingData = listArr
                console.log(this.settingData);
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
       * @Description: 打开新增or编辑弹窗
       * @author Wish
       * @date 2020/3/24
      */
      openSettingBtn(type,val){
        console.log(type, val);
        this.settingType = type
        this.settingDialog = true
        this.settingForm = val? val: {}
      },

      /**
       * @Description: 保存按钮
       * @author Wish
       * @date 2020/3/24
      */
      saveSettingData(){
        let data
        if(this.settingType === 'add'){
          this.settingForm.max_alarm_num = Number(this.settingForm.max_alarm_num)
          this.settingForm.number = Number(this.settingForm.number)
          data = this.settingForm
        }else {
          data = {
            project: this.settingForm.project,
            number: Number(this.settingForm.max_alarm_num),
            author: this.settingForm.author
          }
        }
        let url = this.settingType === 'add'? 'http://192.168.0.36:8081/settings/set': 'http://192.168.0.36:8081/settings/alarm'
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

    },
    created() {
      this.getSettingData()
    }
  }
</script>

<style scoped lang="less">
  .setting_views{

  }
  /deep/.el-dialog__body{
    padding-bottom: unset;
  }
</style>