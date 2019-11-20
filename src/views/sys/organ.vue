<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8" height="90%">
        <el-tree ref="organTree" :data="organs" node-key="id" :default-expanded-keys="[clickNode.id]" :props="{label:'name'}" @node-click="handleNodeClick">

        </el-tree>
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
                @click="addOrganForm={};saveBtnDisabed=false;addDialogVisible=true;dialogTitle='新增部门'"
              >新增部门</el-button>
              <span style="margin-left:10px">当前部门：{{clickNode.name}}</span>
            </el-col>
          
          </el-row>

          <!-- 数据表格 -->
          <el-table :data="clickNodeOrgans" border style="width: 100%;margin:10px 0;">
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
    </el-row

    <!-- 新增部门 -->
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="form" :model="addOrganForm" label-width="80px" :rules="rules">
        <el-form-item label="上级部门">
          <el-input v-model="clickNode.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addOrganForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addOrganForm.code"></el-input>
        </el-form-item>
        <el-row>
          <el-button :size="$store.state.size" @click="saveOrgan" :disabled="saveBtnDisabed">保存</el-button>
          <el-button type="danger" :size="$store.state.size" @click="addDialogVisible=false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { isDecimal, isInteger } from "@/libs/validator.js";
import tree from '@/libs//tree'
export default {
  data: function() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        code: [{ required: true, message: "请输入" }, { validator: isInteger }]
      },
      searchDate: "",
      addDialogVisible: false,
      saveBtnDisabed: false,
      addOrganForm: {},
      organs: [],
      clickNodeOrgans:[],
      clickNode:{id:"0"},
      dialogTitle:"新增部门"
    };
  },

  methods: {
    
    load() {
        let _self=this;
        this.$api.get("/sys/organ/list").then(res=>{
            if(res.code==0 && res.data){

                // 属性配置设置
                let attr = {
                  id: 'id',
                  parendId: 'pid',
                  name: 'name',
                  rootId: 0
                };
                res.data.push({id:0,name:"组织部门"});
                let treeData=tree.toTreeData(res.data,attr)
                _self.organs=treeData;
            }
        })
    },
    getParentNode(node,nodePath){
      if(node.pid&&node.pid!=0){
        let pnode=this.$refs.orgnTree.getNode(node.pid)
        nodePath.push(pnode);
        this.getParentNode(node,nodePath);
      }
    },
    handleNodeClick(node){
      
      let nodePath=[];
      nodePath.push(node);
      this.getParentNode(node,nodePath);
      let _self=this;
      _self.clickNode=node;
        this.$api.get("/sys/organ/list?id="+node.id).then(res=>{
          if(res.code==0){
            _self.clickNodeOrgans=res.data;
            
          }
        });
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
              if (res.code == 0) {
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
    },
    del(row){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '删除确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //要删除的ID
                this.$api.post("/sys/organ/delete",{id:row.id}).then(res=>{
                    if(res.code==0){
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      this.load();
                      this.handleNodeClick(this.clickNode)
                    }
                })
            });
    },
    edit(row){
      this.dialogTitle='修改部门';
      this.addOrganForm=row;
      this.addDialogVisible=true;
      this.saveBtnDisabed=false;
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