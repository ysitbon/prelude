import chai                          from "chai";
import {resetSpy, restoreSpy, spyFn} from "@prelude/test-spies";
import {extension}                   from "@prelude/trait";
import {Functor}                     from "@prelude/functor";
import {Applicative}                 from "@prelude/applicative";
import {Monad, flatMap}              from "../index.js";
const {expect} = chai;

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
  describe("flapMap(fn: (x: A) => F<B>, functor: F<A>): F<B>", () => {
    const [spy, add] = spyFn(x => new Identity(x + 1));

    beforeEach(() => resetSpy(spy));

    it("should call the [Monad.flatMap] symbol", () => {
      flatMap(add, new Identity(1));
      expect(spy.called).to.be.true;
    });

    it("should call the [Monad.flatMap] symbol with the Monad value", () => {
      flatMap(add, new Identity(1));
      expect(spy.calls[0].args).to.deep.equal([1]);
    });

    it("should returns the passed Monad with the mapped value", () => {
      const value = flatMap(add, new Identity(1));
      expect(value.value).to.equal(2);
    });

    after(() => restoreSpy(spy));
  });
});
