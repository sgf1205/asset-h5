<template>
  <div>
    <da-breadcrumb></da-breadcrumb>
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
            <el-table-column align="center" :label="'部门：'+clickNode.name+'下资产,共'+totalSize+'件'" >
              <template slot-scope="scope">
                 <span :style="!codeStyle[scope.row.id]?'color:red':''">{{scope.row.name}}【{{scope.row.code}}】</span>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
      <el-col :span="10">
          <!-- 数据表格 -->
          
          <el-table :data="scanAssets" border style="width: 100%;margin:10px 0;">
            <el-table-column align="center" :label="'已扫描'+scanAssets.length+'件'" >
                <template slot-scope="scope">
                  {{scope.row.name}}[{{scope.row.code}}]
                </template>
            </el-table-column>
          </el-table>
          <el-row style="margin:10px 0;">
            <el-col :span="24">
              <el-button
                type="primary"
                :size="$store.state.size"
                @click="openSaveDialog"
                :disabled="alreadySave"
              >保存盘点记录</el-button>
            </el-col>
          </el-row>
      </el-col>
    </el-row>

    <!-- 保存盘点记录 -->
    <el-dialog title="保存盘点记录" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="form" :model="checkInfo" label-width="180px" :rules="rules">
        <el-form-item label="盘点人所在部门" prop="organId">
          <organ-select :organId="checkInfo.organId" @changeId="changeOrganId"></organ-select>
        </el-form-item>
        <el-form-item label="盘点人" prop="user">
          <el-input v-model="checkInfo.user"></el-input>
        </el-form-item>
        <el-row>
          <el-button :size="$store.state.size" @click="saveCheckInfo" :disabled="alreadySave">保存</el-button>
          <el-button type="danger" :size="$store.state.size" @click="addDialogVisible=false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

import tree from '@/libs//tree'
import organSelect from "../sys/OrganSelect"
import daBreadcrumb from "@/components/da-breadcrumb";

export default {
  components: {
    "organ-select": organSelect,
    daBreadcrumb
  },
  data: function() {
    return {
      rules: {
        user: [{ required: true, message: "请输入盘点人姓名", trigger: "blur" }],
        organId: [{ required: true, message: "请选择盘点人部门", trigger: "blur" }]
      },
      organs: [],
      clickNodeOrgans:[],
      clickNode:{id:"0",name:"未选择"},
      registerData: [],
      scanAssets:[],
      totalSize:0,
      codeStyle:[],
      alreadySave:false,
      addDialogVisible:false,
      checkInfo:{}
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
          
          _self.registerData.forEach(rd=>{_self.codeStyle[rd.id]=false})
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
    openSaveDialog(e){
      e.srcElement.blur()
      if(this.scanAssets.length ==0 ){
        this.$message({
              type: "error",
              message: "没有任何盘点信息!"
            })
        return
      }
      if(this.scanAssets.length < this.registerData.length){
        this.$confirm('已盘点数量少于应盘点数量，确认保存？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.addDialogVisible=true
            });
      }else{
        this.addDialogVisible=true
      }
    },
    changeOrganId(organId) {
      this.checkInfo.organId = organId;
    },
    saveCheckInfo(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.checkInfo.needCheckAssets=this.registerData.map(asset => asset.id)
          this.checkInfo.alreadyCheckAssets=this.scanAssets.map(asset => asset.id)
          this.alreadySave=true;
          this.addDialogVisible=false;
          this.$api.post("/check/save",this.checkInfo).then(res=>{
            if(res.code==0){
                this.$message({
                  type: "success",
                  message: "保存盘点信息成功!"
                })
            }
          })
        }
      })
    }
  },
  created() {
      this.load();
      let _self=this
      let b=''
      document.onkeydown = function() {
        //console.log(b +" "+event.keyCode)
        if(_self.alreadySave)
          return
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
            .get("/asset/getByCodeAndUsingOrganId", {code:b,usingOrganId:_self.clickNode.id})
            .then(res => {
              if(res.code==0 && res.data){
                //_self.codeStyle[res.data.id]=true
                _self.$set(_self.codeStyle,res.data.id,true);
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