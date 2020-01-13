export class Spy {
  constructor() {
    this.called = false;
    this.calls  = [];
  }

  on(fn) {
    return (...args) => {
      const call = {args: args, returns: fn(...args)};
      this.called = true;
      this.calls.push(call);
      return call.returns;
    };
  }

  restore() {
    this.called = false;
    this.calls.length = 0;
  }
}