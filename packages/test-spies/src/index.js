export const spies = () => new Spy();

class Spy {
  constructor() {
    this.map = new Map();
  }

  onMethod(scope, property) {
    const scopedFn = scope[property];
    const mockMap = this.map;
    /*eslint-disable-next-line require-jsdoc*/
    function newFn(...args) {
      const entry = mockMap.get(newFn);
      const call = {args, returns: scopedFn.apply(this, args)};
      entry.called += 1;
      entry.calls.push(call);
      return call.returns;
    }
    Object.defineProperty(scope, property, readonly(newFn));
    this.map.set(newFn, emptyHistory(scopedFn));
    return newFn;
  }

  on(fn) {
    const mockMap = this.map;
    const newFn = (...args) => {
      const entry = mockMap.get(newFn);
      const call = {args: args, returns: fn(...args)};
      entry.called += 1;
      entry.calls.push(call);
      return call.returns;
    };
    this.map.set(newFn, emptyHistory());
    return newFn;
  }

  calledOnce(fn) {
    if (this.map.has(fn)) {
      const {called} = this.map.get(fn);
      return called === 1;
    }
    else {
      throw new Error("calledOnce: Unknown spy function");
    }
  }

  calledWith(fn, ...args) {
    if (this.map.has(fn)) {
      const {calls} = this.map.get(fn);
      return deepEquals(calls[calls.length - 1].args, args);
    }
    else {
      throw new Error("calledWith: Unknown spy function");
    }
  }

  resetHistory(fn) {
    if (this.map.has(fn)) {
      const {scopedFn} = this.map.get(fn);
      if (scopedFn) {
        this.map.set(fn, emptyHistory(scopedFn));
      }
      else {
        this.map.set(fn, emptyHistory());
      }
    }
    else {
      throw new Error("resetHistory: Unknown spy function");
    }
  }

  restoreMethod(scope, property) {
    const fn = scope[property];
    if (this.map.has(fn)) {
      const {scopedFn} = this.map.get(fn);
      Object.defineProperty(scope, property, readonly(scopedFn));
    }
    else {
      throw new Error("restoreMethod: Unknown spy function");
    }
  }

  restore(fn) {
    if (this.map.get(fn)) {
      this.map.delete(fn);
    }
  }
}

const emptyHistory = scopedFn => ({
  scopedFn,
  called: 0,
  calls: []
});

const deepEquals = (x, y) => {
  if (x == null || y == null) {
    return (x === null && y === null) || (x === undefined && y === undefined);
  }
  const typeOf = typeof x;
  if ("number" === typeOf || "boolean" === typeOf || "string" === typeOf) {
    return x === y;
  }
  else if (Array.isArray(x)) {
    return x.length === y.length
      && x.every((_, i) => deepEquals(x[i], y[i]));
  }
  else {
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    return xKeys.length ===  yKeys.length
      && xKeys.every(k => deepEquals(x[k], y[k]));
  }
};

const readonly = value => ({
  value,
  writable: false,
  enumerable: true,
  configurable: true
});
