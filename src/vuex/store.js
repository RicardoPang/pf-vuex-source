import { Vue } from './install';
import ModuleCollection from './module/module-collection';
import { forEachValue } from './utils';

function getState(store, path) {
  return path.reduce((newState, current) => {
    return newState[current];
  }, store.state);
}

// module => _raw _children state
function installModule(store, path, module, rootState) {
  let namespaced = store.modules.getNamespace(path);

  if (path.length > 0) {
    // 是子模块 需要将数据处理到rootState上
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    // 添加一个不存在的属性需要使用Vue.set方法 否则无效
    store.withCommitting(() => {
      Vue.set(parent, path[path.length - 1], module.state);
    });
  }
  // 将循环的方法放到类中来维护 Object.entries(module._raw.mutations)
  module.forEachMutation((mutationKey, mutationValue) => {
    store.mutations[namespaced + mutationKey] =
      store.mutations[namespaced + mutationKey] || [];
    store.mutations[namespaced + mutationKey].push((payload) => {
      store.withCommitting(() => {
        mutationValue(getState(store, path), payload);
      });
      store._subscribes.forEach((callback) =>
        callback({ type: mutationKey }, store.state)
      );
    });
  });
  module.forEachAction((actionKey, actionValue) => {
    store.actions[namespaced + actionKey] =
      store.actions[namespaced + actionKey] || [];
    store.actions[namespaced + actionKey].push((payload) => {
      actionValue(store, payload);
    });
  });
  module.forEachGetter((getterKey, getterValue) => {
    // 应该先判断一下store.getters是否有这个属性 如果有就不必要再注册
    if (store.wrapperGetters[namespaced + getterKey]) {
      return console.error('duplicate key');
    }
    store.wrapperGetters[namespaced + getterKey] = () => {
      return getterValue(getState(store, path));
    };
  });
  // 将循环的方法放到类中来维护 Object.entries(module._children)
  module.forEachChildren((childName, childValue) => {
    installModule(store, path.concat(childName), childValue, rootState);
  });
}

function resetVM(store, state) {
  let oldVm = store.vm; // 拿到以前的
  const computed = {};
  store.getters = {};
  forEachValue(store.wrapperGetters, (getterKey, getterValue) => {
    computed[getterKey] = () => getterValue(store.state);
    Object.defineProperty(store.getters, getterKey, {
      get: () => store.vm[getterKey], // vuex中的getters只有get
    });
  });
  store.vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  store.vm.$watch(
    () => store.vm._data.$$state,
    () => {
      console.assert(store._commiting, 'outside mutation...');
    },
    { deep: true, sync: true }
  );
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy()); // 卸载之前重新搞一个新的实例
  }
}

class Store {
  constructor(options) {
    // 将用户传递的选项进行格式化操作 格式化成一个我容易理解的数据结构
    this.modules = new ModuleCollection(options);
    this.actions = {}; // 存放所有模块的action
    this.mutations = {}; // 存放所有模块的mutation
    this._commiting = false; // 不是在mutation中修改的
    // 将子的状态定义在父的状态上
    this.wrapperGetters = {};
    // 除了安装 mutation action getters 这些之外 最重要的是状态
    const state = options.state;
    this._subscribes = [];
    installModule(this, [], this.modules.root, state); // state跟模块的状态对象
    resetVM(this, state);
    if (options.plugins) {
      options.plugins.forEach((plugin) => plugin(this));
    }
  }
  withCommitting(fn) {
    this._commiting = true;
    fn(); // 如果这个函数是异步执行 那么_commiting会先变为false
    this._commiting = false;
  }
  replaceState(newState) {
    // 如果直接将状态替换会导致代码里用的是以前的 状态显示的是最新 改以前的不会导致视图更新
    this.withCommitting(() => {
      this.vm._data.$$state = newState;
    });
  }
  subscribe(callback) {
    this._subscribes.push(callback);
  }
  get state() {
    return this.vm._data.$$state;
  }
  dispatch = (actionKey, payload) => {
    let actions = this.actions[actionKey];
    actions && actions.forEach((fn) => fn(payload));
  }; // this.actions
  commit = (mutationKey, payload) => {
    let mutations = this.mutations[mutationKey];
    mutations && mutations.forEach((fn) => fn(payload));
  }; // this.mutations
  // 动态注册的原理就是把vuex的注册逻辑重新来一遍
  // 先注册进去 再进行安装 重新创造实例
  registerModule(path, rawModule) {
    // 如果是一个字符串就包装成数组
    if (!Array.isArray(path)) {
      path = [path];
    }
    this.modules.register(path, rawModule);
    // 安装模块的时候 需要传入的是包装后的不是用户写的
    installModule(this, path, rawModule.wrapperModule, this.state); // 将自己生产的模块装到全局上
    resetVM(this, this.state);
  }
}

// Vuex中的插件机制 Vuex数据刷新后丢失怎么办? 存到本地,, 每次加载获取一下. 每次调用接口拿到数据塞到Vuex中

export default Store;
