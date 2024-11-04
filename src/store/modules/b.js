export default {
  namespaced: true,
  state: {
    age: 20000,
  },
  mutations: {
    addAge(state, payload) {
      state.age += payload;
    },
  },
};
