import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store= new Vuex.Store({
  state: {
    size:'small',
    roles:[
      {id:1,name:"系统管理员"},
      {id:2,name:"普通管理员"}
    ],
    isLogin:false,
    currentUser:{},
    pageSize:[10, 20, 30, 50]
  },
  mutations: {
    saveCurrentUser(state,user){
        if(user){
            state.currentUser = user;
            state.isLogin=true;
        }
      
    }
  },
  actions: {

  }
})

export default store