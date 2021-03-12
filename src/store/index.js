import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shopCarcount:0,
    //标记购物袋
    shopSign:false
  },
  mutations: {
    changeShopcarCount(state,payload){
      state.shopCarcount = payload
    },
    changeshopSign(state,payload){
      state.shopSign = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
