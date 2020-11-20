/*eslint-env mocha*/
import {impl}                   from "@prelude/data-trait";
import {Functor, map, constMap} from "../lib/index.js";
import {testLaw}                from "../lib/laws.js";
import {spies}                  from "@prelude/test-spies";
import assert                   from "assert";

describe("@prelude/trait-functor", () => {
  const spy = spies();

  describe("map(fn, functor)", () => {
    const add  = spy.on(x => x + 1);

    beforeEach(() => spy.onMethod(Identity.prototype, Functor.map));
    afterEach(() => spy.restore(Identity.prototype, Functor.map));
    afterEach(() => spy.resetHistory(add));

    it("should call the [Functor.map] symbol", () => {
      Identity(1) |> map(add);
      assert.ok(spy.calledOnce(Identity.prototype[Functor.map]));
    });

    it("should call [fn]", () => {
      Identity(1) |> map(add);
      assert.ok(spy.calledOnce(add));
    });

    it("should call [fn] with inner [functor] value", () => {
      Identity(1) |> map(add);
      assert.ok(spy.calledWith(add, 1));
    });

    it( "should returns the computation result "
      + "wrapped into a [Functor]", () => {
      assert.deepStrictEqual(
        Identity(1) |> map(add),
        Identity(2)
      );
    });
  });

  describe("constMap(value, functor)", () => {
    it("should returns a [Functor] containing the input [value]", () => {
      assert.deepStrictEqual(
        Identity(1) |> constMap(2),
        Identity(2)
      );
    });
  });

  describe(
    "impl Array.prototype for @prelude/trait-functor",
    () => testLaw([1])
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
});
