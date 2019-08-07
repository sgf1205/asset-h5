import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routeMaps = [
  {
    path: '/',
    name: 'Login',
    component: ()=>import('@/views/Login/Login')
  },
  {
    path:"/main",
    name:"Main",
    component:()=>import('@/views/Main/Main'),
    meta:{ title:"主页" },
    children:[
      {
        path:"",
        name:"Dashboard",
        hidden:false,
        component:()=>import('@/views/Dashboard/Dashboard'),
        meta:{ title:"仪表盘",icon:'el-icon-dashboard' }
      },
      {
        path:"register",
        name:"Register",
        hidden:false,
        component:()=>import('@/views/Register/Register'),
        meta:{ title:"资产登记",icon:'el-icon-qianyuejilu' }
      },
      {
        path:"collar",
        name:"Collar",
        hidden:false,
        component:()=>import('@/views/Collar/Collar'),
        meta:{ title:"资产领用",icon:'el-icon-jieyong'}
      },
      {
        path:"borrow",
        name:"Borrow",
        hidden:false,
        component:()=>import('@/views/Borrow/Borrow'),
        meta:{ title:"借用归还",icon:'el-icon-jiehuan'}
      },
      {
        path:"modify",
        name:"Modify",
        hidden:false,
        component:()=>import('@/views/Modify/Modify'),
        meta:{ title:"信息修改",icon:'el-icon-xiugai'}
      },
      {
        path:"repair",
        name:"Repair",
        hidden:false,
        component:()=>import('@/views/Repair/Repair'),
        meta:{ title:"维修管理",icon:'el-icon-weixiu'}
      },
      {
        path:"scrap",
        name:"Scrap",
        hidden:false,
        component:()=>import('@/views/Scrap/Scrap'),
        meta:{ title:"报废管理",icon:'el-icon-feiqi'}
      },
      {
        path:"census",
        name:"Census",
        hidden:false,
        component:()=>import('@/views/Census/Census'),
        meta:{ title:"资产统计",icon:'el-icon-zhexian' },
        children:[
          {
            path:"bill",
            name:"Bill",
            hidden:false,
            component:()=>import('@/views/Bill/Bill'),
            meta:{ title:"资产清单"}
          },
          {
            path:"classify",
            name:"Classify",
            hidden:false,
            component:()=>import('@/views/Classify/Classify'),
            meta:{ title:"分类使用情况"}
          },
          {
            path:"summary",
            name:"Summary",
            hidden:false,
            component:()=>import('@/views/Summary/Summary'),
            meta:{ title:"资产分类汇总"}
          }
        ]
      },
      {
        path:"manage",
        name:"Manage",
        hidden:false,
        component:()=>import('@/views/Manage/Manage'),
        meta:{ title:"系统管理",icon:'el-icon-guanli' },
        children:[
          {
            path:"classes",
            name:"Classes",
            hidden:false,
            component:()=>import('@/views/Classes/Classes'),
            meta:{ title:"资产分类"}
          },
          {
            path:"organ",
            name:"organ",
            hidden:false,
            component:()=>import('@/views/sys/organ'),
            meta:{ title:"机构管理"}
          },
          {
            path:"user",
            name:"user",
            hidden:false,
            component:()=>import('@/views/sys/user'),
            meta:{ title:"用户管理"}
          }
        ]
      },
      {
        path:"password",
        name:"Password",
        hidden:true,
        component:()=>import('@/views/Password/Password'),
        meta:{ title:"修改密码",icon:'el-icon-password'}
      },
      {
        path:"profile",
        name:"Profile",
        hidden:true,
        component:()=>import('@/views/Profile/Profile'),
        meta:{ title:"修改资料",icon:'el-icon-edit-outline'}
      },
      
    ]
  }
];

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeMaps
})
