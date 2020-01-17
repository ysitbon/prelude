import {extension}                from "@prelude/protocol";
import {Applicative, apply, pure} from "../src/protocol.js";

function Identity(value) {
  if (undefined === new.target)
    return new Identity(value);
  else
    this.value = value;
}

extension(Identity.prototype, {
  [Functor.map](fn) {
    return Identity(fn(this.value));
  },
  [Applicative.pure](x) {
    return Identity(x);
  },
  [Applicative.apply](fx) {
    return this[Applicative.pure](this.value(fx.value));
  }
})

describe("@prelude/control-applicative", () => {
  describe("apply(fn: Applicative<((x: A) => B), scope: Applicative<A>): Applicative<B>", () => {

  });

  describe("pure(F: Constructor<A>, value: T): Applicative<T>", () => {

  });
});