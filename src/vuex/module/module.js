import { forEachValue } from '../utils';

class Module {
  constructor(rootModule) {
    this._raw = rootModule;
    this._children = {};
    this.state = rootModule.state;
  }
  get namespaced() {
    return !!this._raw.namespaced;
  }
  getChild(key) {
    return this._children[key];
  }
  addChild(key, module) {
    this._children[key] = module;
  }
  forEachMutation(cb) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, cb);
    }
  }
  forEachAction(cb) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, cb);
    }
  }
  forEachGetter(cb) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, cb);
    }
  }
  forEachChildren(cb) {
    forEachValue(this._children, cb);
  }
}

export default Module;
