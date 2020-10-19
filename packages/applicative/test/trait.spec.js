import chai                          from "chai";
import {resetSpy, restoreSpy, spyFn} from "@prelude/test-spies";
import {extension}                   from "@prelude/trait";
import {Functor}                     from "@prelude/functor";
import {Applicative, apply, pure}    from "../index.js";
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
  }
})

describe("@prelude/applicative", () => {
  describe("apply(fn: Applicative<((x: A) => B), scope: Applicative<A>): Applicative<B>", () => {
    const [spy, add] = spyFn(x => x + 1);

    beforeEach(() => resetSpy(spy));

    it("should call the [Applicative.apply] symbol", () => {
      apply(new Identity(1), new Identity(add));
      expect(spy.called).to.be.true;
    });

    it("should call the [Applicative.apply] symbol with the [Functor] value", () => {
      apply(new Identity(1), new Identity(add));
      expect(spy.calls[0].args).to.deep.equal([1]);
    });

    it("should returns the passed Functor with mapped value", () => {
      expect(apply(new Identity(1), new Identity(x => x + 1)))
          .to.deep.equal(new Identity(2));
    });

    after(() => restoreSpy(spy));
  });

  describe("pure(F: Constructor<A>, value: T): Applicative<T>", () => {
    it("should box the passed value", () => {
      expect(pure(Identity, 1)).to.deep.equal(new Identity(1));
    });
  });
});
