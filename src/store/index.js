import Vue from 'vue';
// import Vuex from 'vuex'; // 原生
import Vuex from '../vuex'; // 手写
import a from './modules/a';
import b from './modules/b';

// Vue.use的操作目的是帮我们使用插件
// Vue.use = function (plugin, options) { // use方法默认会将Vue的构造函数传入到插件中 为了解决写插件的时候依赖Vue的问题
//   if (typeof plugin === 'function') {
//     return plugin(this, options);
//   } else {
//     plugin.install(this, options);
//   }
// };
Vue.use(Vuex);

const persitsPlugin = (store) => {
  let persists = localStorage.getItem('VUEX_PERSITS');
  if (persists) {
    store.replaceState(JSON.parse(persists));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem('VUEX_PERSITS', JSON.stringify(state));
  });
};

const Store = new Vuex.Store({
  strict: true,
  plugins: [persitsPlugin],
  state: {
    age: 12,
    a: 100,
    b: 200,
  },
  getters: {
    myAge(state) {
      return state.age + 20;
    },
  },
  mutations: {
    addAge(state, payload) {
      state.age += payload;
    },
  },
  actions: {
    addAge({ commit }, payload) {
      setTimeout(() => {
        commit('addAge', payload);
      }, 2000);
    },
  },
  modules: {
    a,
    b,
  },
});

setTimeout(() => {
  Store.registerModule('cc', {
    state: {
      a: 66,
      b: 88,
    },
    getters: {
      myA(state) {
        return state.a + 100;
      },
    },
  });
}, 1000);

export default Store;
