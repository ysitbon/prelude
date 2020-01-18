export const resetSpy = self => {
  self.called = false;
  self.calls.length = 0;
}

export const restoreSpy = self => {
  if (undefined !== self.origin)
    Object.defineProperty(self.subject, self.member, self.origin);
  self.subject = undefined;
  self.origin  = undefined;
}

export const spyFn = fn => {
  const spy = Spy();
  return [spy, function(...args) {
    const call = {args: args, returns: fn.apply(this, args)};
    spy.called = true;
    spy.calls.push(call);
    return call.returns;
  }];
}

export const spyMethod = (subject, member) => {
  const descriptor = Object.getOwnPropertyDescriptor(subject, member);
  const [spy, value] = spyFn(descriptor.value)
  Object.defineProperty(subject, member, {...descriptor, value});
  spy.subject = subject;
  spy.member  = member;
  spy.origin  = descriptor;
  return spy;
}

function Spy() {
  if (undefined === new.target) {
    return new Spy();
  }
  else {
    this.called  = false;
    this.calls   = [];
    this.subject = undefined;
    this.member  = undefined;
    this.origin  = undefined;
  }
}