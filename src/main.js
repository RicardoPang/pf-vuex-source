import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App), // 默认引用的是runtime-only 不包含将template -> render函数
}).$mount('#app');

// 1.默认会创建一个store容器的实例 将store传入vue实例中
// 2.内部会将store定义到每个组件时 this.$store.state
