<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8" height="90%" align="center">
  
          <el-menu
            default-active="1"
            @select="selectRoleHandler"
            >
            <el-menu-item  v-for="role in $store.state.roles" :key="role.id" :index="role.id">
              {{role.name}}
            </el-menu-item>
          </el-menu>
  
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <!-- 按钮组 + 搜索栏 -->
          <el-row>
            <!-- 按钮组 -->
            <el-col :span="12">
              <el-button
                type="primary"
                :size="$store.state.size"
                icon="el-icon-plus"
              >保存配置</el-button>
              <span style="margin-left:10px">当前角色：{{selectRole}}</span>
            </el-col>
          
          </el-row>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
            <el-checkbox label="禁用" disabled></el-checkbox>
            <el-checkbox label="选中且禁用" disabled></el-checkbox>
          </el-checkbox-group>
        </el-card>
      </el-col>
    </el-row>

    
  </div>
</template>
<script>

import tree from '@/libs//tree'
import organSelect from './OrganSelect'
export default {
  components: {
    'organ-select':organSelect
  },
  data: function() {
    return {
      
      selectRole: "系统管理员",
      menus:[]
    };
  },

  methods: {
    
    load() {
        let _self=this;
        this.$api.get("/sys/organ/list").then(res=>{
            if(res.data.code==0 && res.data.data){

                // 属性配置设置
                let attr = {
                  id: 'id',
                  parendId: 'pid',
                  name: 'name',
                  rootId: 0
                };
                res.data.data.push({id:0,name:"组织机构"});
                let treeData=tree.toTreeData(res.data.data,attr)
                _self.organs=treeData;
            }
        })
    },
    selectRoleHandler(roleId,indexPath){
      let _self=this;
      this.$store.state.roles.forEach(role =>{
        if(role.id==roleId){
          _self.selectRole=role.name
          return false;
        }
      })
       //this.selectRole=indexPath

    },
    saveOrgan() {
      let _self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          _self.saveBtnDisabed = true;
          _self.addOrganForm.pid=_self.clickNode.id;
          _self.$api
            .post("/sys/organ/save", _self.addOrganForm)
            .then(res => {
              if (res.data.code == 0) {
                _self.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.addDialogVisible=false;
                this.load();
                _self.handleNodeClick(_self.clickNode)
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