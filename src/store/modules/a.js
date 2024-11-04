export default {
  namespaced: true, // a/方法名
  state: {
    age: 10000,
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
  modules: {
    c: {
      namespaced: true, // a/c/方法名
      state: { a: 1 },
    },
  },
};
