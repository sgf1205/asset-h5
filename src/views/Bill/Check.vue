<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="5" height="90%">
        <el-tree ref="organTree" 
          :data="organs" node-key="id" 
          :default-expanded-keys="[clickNode.id]" 
          :props="{label:'name'}" 
          @node-click="handleNodeClick"
          style="margin-top:10px"
          >

        </el-tree>
      </el-col>
      <el-col :span="9">
          <!-- 数据表格 -->
          <el-table :data="registerData" border style="width: 100%;margin:10px 0;">
            <el-table-column align="center" prop="name" :label="'部门：'+clickNode.name+'下资产,共'+totalSize+'件'" ></el-table-column>
          </el-table>
      </el-col>
      <el-col :span="10">
          <!-- 数据表格 -->
          <el-table :data="scanAssets" border style="width: 100%;margin:10px 0;">
            <el-table-column align="center" prop="name" :label="'已扫描'+scanAssets.length+'件'" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="del(scope.row)" type="text" :size="$store.state.size">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import tree from '@/libs//tree'
export default {
  data: function() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      organs: [],
      clickNodeOrgans:[],
      clickNode:{id:"0",name:"未选择"},
      registerData: [],
      scanAssets:[],
      totalSize:0
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
      let searchForm={}
      searchForm.pageSize=100;
      searchForm.currentPage=1;
      searchForm.usingOrganId=node.id
      _self.$api
        .get("/asset/list", searchForm)
        .then(res => {
        if (res.code == 0 && res.data) {
          _self.registerData = res.data.result;
            //_self.currentPage=res.data.currentPage;
          _self.totalSize = res.data.totalSize;
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
      let _self=this
      let b=''
      document.onkeydown = function() {
        //console.log(b +" "+event.keyCode)
        
        if (event.keyCode != 13) {
          var bizCode = String.fromCharCode(event.keyCode);
          if (event.keyCode >= 48 && event.keyCode <= 122) {
              b = b + bizCode;
          }
        } else {
          if(!_self.clickNode || _self.clickNode.id==0){
            _self.$message({
              type: "error",
              message: "请先选择盘点部门!"
            })
            b = ""; 
            return 
          }
          _self.$api
            .get("/asset/getByCode", {code:b,usingOrganId:_self.clickNode.id})
            .then(res => {
              if(res.code==0 && res.data){
                _self.scanAssets.push(res.data);
              }else{
                _self.$message({
                  type: "error",
                  message: "无对应资产!"
                })
              }
            })
          
            b = "";    
        }   
      }
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