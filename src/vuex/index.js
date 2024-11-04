import { install } from './install';
import Store from './store';

const Vuex = {
  Store, // 容器核心代码
  install, // 将$store属性共享给每个组件 每个组件都可以获取到这个实例 插件的入库 mixin
};

export default Vuex;
