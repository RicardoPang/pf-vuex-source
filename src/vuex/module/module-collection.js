import { forEachValue } from '../utils';
import Module from './module';

class ModuleCollection {
  // 构建父子关系用栈
  constructor(options) {
    this.register([], options); // 递归实现收集要记录父子关系
  }
  getNamespace(path) {
    let module = this.root;
    return path.reduce((namespace, key) => {
      module = module.getChild(key);
      console.log(module);
      return namespace + (module.namespaced ? key + '/' : '');
    }, '');
  }
  register(path, rootModule) {
    let module = new Module(rootModule); // _raw _children state
    rootModule.wrapperModule = module;
    if (path.length == 0) {
      this.root = module;
    } else {
      // ['a'] ['b']
      // 不是根的情况
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current);
      }, this.root);
      parent.addChild(path[path.length - 1], module);
    }
    if (rootModule.modules) {
      // 获取到定义的子模块
      forEachValue(rootModule.modules, (moduleName, moduleValue) => {
        this.register(path.concat(moduleName), moduleValue);
      });
    }
  }
}

export default ModuleCollection;
