<template>
  <div>
    <el-row :gutter="10">
 
      <el-col :span="24">
        <el-card class="box-card">
          <!-- 按钮组 + 搜索栏 -->
          <el-row>
            <!-- 按钮组 -->
            <el-col :span="12">
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-plus"
                @click="addForm={};saveBtnDisabed=false;addDialogVisible=true;dialogTitle='新增用户'"
              >新增用户</el-button>
              
            </el-col>
          
          </el-row>

          <!-- 数据表格 -->
          <el-table :data="users" border style="width: 100%;margin:10px 0;">
            <el-table-column align="center" prop="name" label="姓名" ></el-table-column>
            <el-table-column align="center" prop="account" label="登陆账号" ></el-table-column>
            <el-table-column align="center" prop="organName" label="所属机构" ></el-table-column>
            <el-table-column align="center" prop="roleName" label="角色" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="text" :size="$store.state.size">删除</el-button>
                <el-button type="text" :size="$store.state.size" @click="edit(scope.row)">编辑</el-button>
                <el-button type="text" :size="$store.state.size" @click="restPwd(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增用户 -->
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="form" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="登陆账号" prop="account">
          <el-input v-model="addForm.account"></el-input>
        </el-form-item>        
        <el-form-item label="所属机构" prop="organId">
          <organ-select :organId="addForm.organId" @changeId="changeOrganId"></organ-select>
        </el-form-item>
        <el-form-item label="角色"  prop="roleId">
          <role-select v-model="addForm.roleId" ></role-select>
        </el-form-item>
        <el-row>
          <el-button :size="$store.state.size" @click="save" :disabled="saveBtnDisabed">保存</el-button>
          <el-button type="danger" :size="$store.state.size" @click="addDialogVisible=false;addForm={}">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import organSelect from './OrganSelect'
import roleSelect from './roleSelect'
export default {
  components: {
    'organ-select':organSelect,
    'role-select':roleSelect
  },
  data: function() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        account: [{ required: true, message: "请输入", trigger: "blur" }],
        organId: [{ required: true, message: "请选择", trigger: "blur" }],
        role: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      searchDate: "",
      addDialogVisible: false,
      saveBtnDisabed: false,
      addForm: {},
      users: [],
      dialogTitle:"新增用户"
    };
  },

  methods: {
    
    load() {
        let _self=this;
        this.$api.get("/user/list").then(res=>{
            if(res.code==0 && res.data){
                _self.users=res.data;
            }
        })
    },
    save() {
      let _self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          _self.saveBtnDisabed = true;
          _self.$api
            .post("/user/save", _self.addForm)
            .then(res => {
              if (res.code == 0) {
                _self.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.addDialogVisible=false;
                this.load();
              } else {
                _self.$message({
                  type: "error",
                  message: "添加失败!"
                });
                _self.saveBtnDisabed = false;
              }
            })
            .catch(err => {
              _self.saveBtnDisabed = false;
              throw new Error("请求报错");
            });
        }
      });
    },
    del(row){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '删除确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //要删除的ID
                this.$api.post("/user/delete",{id:row.id}).then(res=>{
                    if(res.code==0){
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    }
                })
            });
    },
    edit(row){
      this.dialogTitle='修改用户';
      this.addForm=row;
      this.addDialogVisible=true;
      this.saveBtnDisabed=false;
    },
    restPwd(row){
       this.$api.post("/user/restPwd",{id:row.id}).then(res=>{
                    if(res.code==0){
                      this.$message({
                        type: 'success',
                        message: '重置密码成功!'
                      });
                    }
                })

    },
    changeOrganId(organId){
      this.addForm.organId=organId;
    }

  },
  created() {
      this.load();
  }
};
</script>
<style lang="less">
.show-dialog {
  .el-input input,
  .el-textarea textarea {
    background-color: #fff !important;
    color: #606266 !important;
    cursor: default !important;
  }
}
</style>