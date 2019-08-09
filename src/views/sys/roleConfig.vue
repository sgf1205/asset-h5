<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8" height="90%" align="center">
  
          <el-menu
            default-active="1"
            @select="selectRoleHandler"
            >
           
              
            <el-menu-item index="1">
             
              系统管理员
            </el-menu-item>
      
            <el-menu-item index="2">

              普通管理员
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

          <!-- 数据表格 -->
          <el-table :data="menus" border style="width: 100%;margin:10px 0;">
            <el-table-column align="center" prop="name" label="名称" ></el-table-column>
            <el-table-column align="center" prop="code" label="编码" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="text" :size="$store.state.size">删除</el-button>
                <el-button type="text" :size="$store.state.size" @click="edit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      console.log("roleId:"+roleId)

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