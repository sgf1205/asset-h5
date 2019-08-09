import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    size:'small',
    roles:[
      {id:1,name:"系统管理员"},
      {id:2,name:"普通管理员"}
    ],
    assetsSource:["购入","自建","捐赠","租赁","其他"],
    classesData:[   //资产分类数据
      {
          id:1,
          label: '土地、房屋及构筑物',
      },
      {
          id:2,
          label: '电气设备',
      }
    ],
    companyData:[
      {
        id:1,
        company_name: '康佳',
        children:[
          {
            id:1,
            department_name:"研发部"
          },
          {
            id:2,
            department_name:"人事部"
          },
          {
            id:3,
            department_name:"财务部"
          }
        ]
      },
      {
        id:2,
        company_name: '康宁',
      }
    ],
    warehouses:[
      {
        warehouse_id:1,
        warehouse_name:"北区仓库",
        company_id:1
      },
      {
        warehouse_id:2,
        warehouse_name:"南区仓库",
        company_id:1
      },
    ],  
    pageSize:[10, 20, 30, 50]
  },
  mutations: {
    chenageSize(state,size){
      state.size = size;
    }
  },
  actions: {

  }
})
