export let Vue; // export导出的是一个变量 如果变量变化了导出的结果也会发生变化
export const install = (_Vue, options) => {
  // 需要在所有组件里面都定义一个$store属性共享给每个组件 把根模块中注入的$store共享出去
  Vue = _Vue;
  Vue.mixin({
    // 让所有的组件都能获取到$store实例 此实例找到的就是main.js中注入的实例
    beforeCreate() {
      const options = this.$options; // 获取用户的所有选项
      if (options.store) {
        // 给根实例增加$store属性
        this.$store = options.store;
      } else if (options.parent && options.parent.$store) {
        // 给组件增加$store属性
        this.$store = options.parent.$store;
      }
    },
  });
};
