/*eslint-env mocha*/
import {Applicative, apply, pure, lift} from "../lib/index.js";
import {testLaw}                        from "../lib/laws.js";
import {impl}                           from "@prelude/data-trait";
import {Functor}                        from "@prelude/trait-functor";
import {spies}                          from "@prelude/test-spies";
import assert                           from "assert";

describe("@prelude/trait-applicative", () => {
  const spy = spies();

  describe("apply(functor, applicative)", () => {
    const add = spy.on(x => x + 1);
    const val = Identity(1);

    beforeEach(() => spy.onMethod(Identity.prototype, Applicative.apply));
    afterEach(() => {
      spy.restoreMethod(Identity.prototype, Applicative.apply);
      spy.resetHistory(add);
    });

    it("should call the [Applicative.apply] symbol", () => {
      Identity(add) |> apply(val);
      assert.ok(spy.calledOnce(Identity.prototype[Applicative.apply]));
    });

    it( "should call the [applicative] inner function", () => {
      Identity(add) |> apply(val);
      assert.ok(spy.calledOnce(add));
    });

    it( "should call the [applicative] inner function "
      + "with inner [functor] value", () => {
      Identity(add) |> apply(val);
      assert.ok(spy.calledWith(add, 1));
    });

    it( "should returns the computation result "
      + "wrapped into the input [Functor]", () => {
      assert.deepStrictEqual(
        Identity(add) |> apply(val),
        Identity(2)
      );
    });
  });

  describe( "pure", () => {
    beforeEach(() => spy.onMethod(Identity.prototype, Applicative.pure));
    afterEach(() => spy.restoreMethod(Identity.prototype, Applicative.pure));

    it("should call the [Applicative.pure] symbol", () => {
      1 |> pure(Identity);
      assert.ok(spy.calledOnce(Identity.prototype[Applicative.pure]));
    });

    it("should wrap the passed value into the input "
      + "[FunctorConstructor]", () => {
      assert.deepStrictEqual(
        1 |> pure(Identity),
        Identity(1)
      );
    });
  });

  describe("liftA", () => {
    const f1 = argA => [argA];
    const f2 = argA => argB => [argA, argB];
    const f3 = argA => argB => argC => [argA, argB, argC];
    const v1 = Identity(1);
    const v2 = Identity(2);
    const v3 = Identity(3);
    it("should lift a function of 1 functors", () => {
      const result = [v1] |> lift(f1);
      assert.deepStrictEqual(result, Identity([1]));
    });
    it("should lift a function of 2 functors", () => {
      const result = [v1, v2] |> lift(f2);
      assert.deepStrictEqual(result, Identity([1, 2]));
    });
    it("should lift a function of 3 functors", () => {
      const result = [v1, v2, v3] |> lift(f3);
      assert.deepStrictEqual(result, Identity([1, 2, 3]));
    });
  });

  describe(
    "impl Array.prototype for @prelude/trait-applicative",
    () => testLaw(Array)
  );

  // eslint-disable-next-line require-jsdoc
  function Identity(value) {
    if (undefined === new.target)
      return new Identity(value);
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
});
