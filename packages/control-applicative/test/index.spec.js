import {expect}                    from "chai";
import {spyMethod, resetSpy, restoreSpy} from "@prelude/test-spies";
import {extension}                 from "@prelude/protocol";
import {Functor}                   from "@prelude/functor";
import {Applicative, apply, pure}  from "../index.js";

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
  [Applicative.apply](ax) {
      console.log("CLAA")
    return this[Applicative.pure](this.value(ax.value));
  }
})

describe("@prelude/control-applicative", () => {
  describe("pure(F: Constructor<A>, value: T): Applicative<T>", () => {
    const spy = spyMethod(Identity.prototype, Applicative.pure);

    beforeEach(() => resetSpy(spy));

    it("should call [Applicative.pure]", () => {
      pure(Identity, 1);
      expect(spy.called).to.be.true;
    });

    after(() => restoreSpy(spy));
  });

  describe("apply(fn: Applicative<((x: A) => B), scope: Applicative<A>): Applicative<B>", () => {
    const spy = spyMethod(Identity.prototype, Applicative.apply);

    beforeEach(() => resetSpy(spy));

    it("should call [Applicative.apply]", () => {
      apply(Identity(x => x + 1), Identity(1));
      expect(spy.called).to.be.true;
    });

    after(() => restoreSpy(spy));
  });
});