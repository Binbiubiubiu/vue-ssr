import { createStore } from 'vuex'



export default function(){
  const store= createStore({
    state: {
      count:0
    },
    mutations: {
      ["ADD"](state){
        state.count++;
      },
      ["SUB"](state){
        state.count--;
      }
    },
    actions: {
    },
    modules: {
    }
  })

  if (typeof window !== "undefined") {
    // 服务环境没有window属性 只有客户端具备window属性
    if (window.__INITIAL_STATE__) {  // 这里是在server-entry中改变完state数据后， context.state自动回转化为weindow.__INITIAL_STATE__
      store.replaceState(window.__INITIAL_STATE__);
    }
  }

  return store;
}