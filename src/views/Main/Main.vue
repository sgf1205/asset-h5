<template>
  <el-container class="container">
    <el-aside width="auto">
      <div class="logo" :style="{padding:isCollapse?'0':'',textAlign:isCollapse?'center':'left'}">
        <i class="el-icon-logo"></i>
        <span class="text" v-show="!isCollapse">资产管理</span>
      </div>
      <el-menu
        :default-active="activeNav"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        :router="true"
        background-color="#2F3E4E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <template v-for="v in routes">
          <el-menu-item :index="v.name" :route="{name:v.name}" :key="v.path" v-if="!v.children">
            <i :class="v.meta.icon"></i>
            <span slot="title">{{v.meta.title}}</span>
          </el-menu-item>
          <el-submenu v-else :key="v.path" :index="v.name">
            <template slot="title">
              <i :class="v.meta.icon"></i>
              <span slot="title">{{v.meta.title}}</span>
            </template>
            <el-menu-item
              :index="val.name"
              :route="{name:val.name}"
              :key="val.path"
              v-for="val in v.children"
            >
              <i class="el-icon-yuan"></i>
              {{val.meta.title}}
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="collapse" @click="isCollapse=!isCollapse">
          <i class="el-icon-ego-menu" :class="{'icon-rotate':isCollapse}"></i>
        </div>
        <el-menu
          menu-trigger="hover"
          :router="true"
          class="el-menu-demo"
          mode="horizontal"
          @select="menuSelectHandler"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-bell"></i>
              <span>消息</span>
            </template>
            <el-menu-item index="3-2" class="message">
              <div class="left">
                <i class="el-icon-bell"></i>
              </div>
              <div class="right">
                <p>新功能上线通知</p>
                <span>2018-08-10</span>
              </div>
            </el-menu-item>
            <el-menu-item index="3-2" class="message">
              <div class="left">
                <i class="el-icon-bell"></i>
              </div>
              <div class="right">
                <p>新功能上线通知</p>
                <span>2018-08-10</span>
              </div>
            </el-menu-item>
            <el-menu-item index="3-2" class="message">
              <div class="left">
                <i class="el-icon-bell"></i>
              </div>
              <div class="right">
                <p>新功能上线通知</p>
                <span>2018-08-10</span>
              </div>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-admin"></i>
              <span>{{currentUserName}}</span>
            </template>
            <el-menu-item index="Password" :route="{name:'Password'}">
              <i class="el-icon-password"></i>
              <span>修改密码</span>
            </el-menu-item>
            <el-menu-item index="Profile" :route="{name:'Profile'}">
              <i class="el-icon-edit-outline"></i>
              <span>修改资料</span>
            </el-menu-item>
            <el-menu-item index="logout">
              <i class="el-icon-tuichudenglu"></i>
              <span>退出登陆</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "Main",
  data() {
    return {
      isCollapse: false,
      activeNav: "Main",
      routes: []
    };
  },
  methods: {
    menuSelectHandler(index) {
      if (index == "logout") {
        this.logOut();
      }
    },
    logOut() {
      var _this = this;
      _this.$api
        .post("/logout")
        .then(res => {
          if (res.code == 0) {
            //delete sessionStorage.roleId;
            delete sessionStorage.token;
            _this.$router.push({ path: "/" });
          } else {
            _this.$message.success(res.msg);
          }
        })
        .catch(err => {
          if (process.env.NODE_ENV == "development") {
            //delete sessionStorage.roleId;
            delete sessionStorage.token;
            _this.$router.push({ path: "/" });
          } else {
            throw new Error("请求报错:" + err);
          }
        });
    }
  },
  computed:{
    currentUserName(){
      return this.$store.state.currentUser.name;
    }
  },
  created(){
    let _self=this;
    this.$api.get("/getCurrentUser").then(res =>{
      if(res.code==0){
        let user=res.data
        _self.$store.commit("saveCurrentUser",user);
        if (user.roleId != 0) {
            this.$api.get("/menus").then(res=>{
                if(res.code==0){
                    let menus=res.data;
                    let allMenus=_self.$router.options.routes[1].children;
                    allMenus.forEach(m=>{
                      if(menus.indexOf(m.name)!=-1){
                        _self.routes.push(m);
                      }else if(m.children){
                        let subMenus=m.children.filter(
                              v => menus.indexOf(v.name) != -1
                          );
                        if(subMenus.length>0){
                          let _m=Object.assign({}, m)
                          _m.children=subMenus
                          _self.routes.push(_m);
                        }
                      }
                    })
                }
            })
        } else {  //超级管理员
          this.routes = _self.$router.options.routes[1].children.filter(v =>v.hidden!=true);
        }
        this.activeNav = _self.$route.name;
      }
    }).catch(err=>{
      if(process.env.NODE_ENV=='development'){
        let user={roleId:0,name:"超级管理员"}
        this.$store.commit("saveCurrentUser",user);
        this.routes = _self.$router.options.routes[1].children.filter(v =>v.hidden!=true);
      } 
    })
  }
};
</script>
<style lang="less">
@import "../../assets/less/public.less";
@headerHeight: 60px;
.container {
  height: 100%;
  background: #f9f9f9;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-aside {
    background-color: @baseBgColor;
    .logo {
      height: @headerHeight;
      padding: 0 20px;
      text-align: left;
      background-color: @baseBgColor;
      color: #fff;
      i {
        font-size: 36px;
        margin: 12px 0;
        vertical-align: middle;
      }
      .text {
        font-size: 22px;
        height: 100%;
        vertical-align: top;
        line-height: 64px;
        padding: 0 2px;
        display: inline-block;
      }
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-header {
    background: #fff;
    border-bottom: solid 1px #e6e6e6;
    padding: 0;
    .collapse {
      width: @headerHeight;
      height: @headerHeight;
      text-align: center;
      line-height: @headerHeight;
      float: left;
      font-size: 20px;
      color: @baseBgColor;
      i {
        transition: all 0.5s;
      }
      i.icon-rotate {
        transform: rotate(90deg);
      }
    }
    .logo {
      float: left;
      height: @headerHeight;
      img {
        height: 30px;
        margin-top: 15px;
      }
    }
    .el-menu {
      float: right;
      height: 100%;
    }
  }
  .el-main {
    padding: 0 20px 20px;
  }
}
.message.el-menu-item {
  display: flex;
  height: 50px !important;
  font-size: 12px;
  border-bottom: 1px solid #eee;
  &:last-of-type {
    border: none;
  }
  .left {
    width: 36px;
    height: 36px;
    margin: 7px 10px 7px 0;
    i {
      width: 100%;
      height: 100%;
      background-color: #f2f2f2;
      border-radius: 50%;
      text-align: center;
      line-height: 36px;
    }
  }
  .right {
    margin: 5px 0;
    height: 40px;
    line-height: 20px;
  }
}
</style>


