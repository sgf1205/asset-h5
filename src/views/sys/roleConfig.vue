<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8" height="90%" align="center">
  
          <el-menu
            :default-active="selectRole.id.toString()"
            @select="selectRoleHandler"
            >
            <el-menu-item  v-for="role in $store.state.roles" :key="role.id" :index="role.id.toString()">
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
                @click="saveConfig"
              >保存配置</el-button>
              <span style="margin-left:10px">当前角色：{{selectRole.name}}</span>
            </el-col>
          
          </el-row>
          <el-row style="margin-top:20px">
             <el-tree 
                ref="tree" 
                :data="menus" 
                node-key="name"
                :props="{id:'name'}" 
                :show-checkbox="true"
                :default-expand-all="true"/>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    
  </div>
</template>
<script>

import tree from '@/libs//tree'
export default {
  data: function() {
    return {
      
      selectRole: this.$store.state.roles[0],
      routes:[],
      menus:[],
      roleMenus:[]
     
      
    };
  },

  methods: {
    
    load() {
        let _self=this;
        let routes = this.routes = this.$router.options.routes[1].children.filter(v=>v.hidden==false);
        

        let change=function(route){
           let menu={};
           menu.name=route.name;
           menu.label=route.meta.title;
           if(route.children){
             menu.children=[];
             route.children.forEach(r=>menu.children.push(change(r)))
           }
          return menu;
        }

        routes.forEach(route => {
          _self.menus.push(change(route));
        })

        //this.loadConfig();

        
    },
    loadConfig(){
        let _self=this;
        this.$refs.tree.setCheckedKeys([]);
        this.$api.get("/role/list?roleId="+this.selectRole.id).then(res=>{
          if(res.code==0){
              let configMenus=[];
              res.data.forEach(config=>{
                configMenus.push(config.menu);
              })
              _self.$refs.tree.setCheckedKeys(configMenus);
          }
        });
    },
    selectRoleHandler(roleId,indexPath){
      let _self=this;
      this.$store.state.roles.forEach(role =>{
        if(role.id==roleId){
          _self.selectRole=role
          this.loadConfig();
          return false;
        }
      })
      

    },
    saveConfig() {
      let menus=this.$refs.tree.getCheckedNodes().map(node=>node.name)
      this.$api.post("/role/config",{roleId:this.selectRole.id,roleName:this.selectRole.name,menus:menus}).then(res=>{
          this.$message({
            type: "success",
            message: "角色配置成功!"
          });
      });
    }
  },
  mounted(){
     this.load();
    this.loadConfig();
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