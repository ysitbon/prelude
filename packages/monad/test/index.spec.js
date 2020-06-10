import {extension}      from "@prelude/protocol";
import {Monad, flatMap} from "../";

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
  },
  [Monad.flatMap](fn) {
    return fn(this.value);
  }
})

describe("@prelude/monad", () => {
  describe("flatMap()", () => {

  });
});
