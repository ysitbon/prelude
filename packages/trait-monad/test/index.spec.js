/*eslint-env mocha*/
import {impl}           from "@prelude/data-trait";
import {Functor}        from "@prelude/trait-functor";
import {Applicative}    from "@prelude/trait-applicative";
import {Monad, flatMap} from "../lib/index.js";
import {testLaw}        from "../lib/laws.js";
import {spies}          from "@prelude/test-spies";
import assert           from "assert";

describe("@prelude/trait-monad", () => {
  const spy = spies();

  describe("flapMap(fn, monad)", () => {
    const add  = spy.on(x => Identity(x + 1));

    beforeEach(() => spy.onMethod(Identity.prototype, Monad.flatMap));
    afterEach(() => spy.restore(Identity.prototype, Monad.flatMap));
    afterEach(() => spy.resetHistory(add));

    it("should call the [Monad.flatMap] symbol", () => {
      Identity(1) |> flatMap(add);
      assert.ok(spy.calledOnce(Identity.prototype[Monad.flatMap]));
    });

    it("should call [fn]", () => {
      Identity(1) |> flatMap(add);
      assert.ok(spy.calledOnce(add));
    });

    it("should call [fn] with inner [monad] value", () => {
      Identity(1) |> flatMap(add);
      assert.ok(spy.calledWith(add, 1));
    });

    it("should returns the computation result "
      + "wrapped into the input [Monad]", () => {
      assert.deepStrictEqual(
        Identity(1) |> flatMap(add),
        Identity(2)
      );
    });
  });

  describe(
    "impl Array.prototype for @prelude/trait-monad",
    () => testLaw(Array)
  );

  // eslint-disable-next-line require-jsdoc
  function Identity(value) {
    if (undefined === new.target)
      return new Identity(value);
    else
      this.value = value;
  }
  Identity |> impl(Functor, {
    [Functor.map](fn) {
      return Identity(fn(this.value));
    }
  });
  Identity |> impl(Applicative, {
    [Applicative.pure](x) {
      return Identity(x);
    },
    [Applicative.apply](fx) {
      return this[Applicative.pure](this.value(fx.value));
    }
  });
  Identity |> impl(Monad, {
    [Monad.flatMap](fn) {
      return fn(this.value);
    }
  });
});
