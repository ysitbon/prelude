/*eslint-env mocha*/
import assert          from "assert";
import {spies}         from "@prelude/test-spies";
import {impl}          from "@prelude/data-trait";
import {Semigroup}     from "@prelude/trait-semigroup";
import {Monoid, empty} from "../lib/index.js";

describe("@prelude/trait-monoid", () => {
  const spy = spies();

  describe("empty()", () => {
    beforeEach(() => spy.onMethod(List.prototype, Monoid.empty));
    afterEach(() => spy.restore(List.prototype, Monoid.empty));

    it("should call the [Monoid.empty] symbol", () => {
      List |> empty;
      assert.ok(spy.calledOnce(List.prototype[Monoid.empty]));
    });

    it("should returns the empty representation", () => {
      assert.deepStrictEqual(
        List |> empty,
        List()
      );
    });
  });

  // eslint-disable-next-line require-jsdoc
  function List(...values) {
    if (undefined === new.target)
      return new List(...values);
    else {
      this.values = [...values];
    }
  }
  List |> impl(Semigroup, {
    [Semigroup.append](values) {
      return List(...this.values, ...values);
    }
  });
  List |> impl(Monoid, {
    [Monoid.empty]() {
      return List();
    }
  });
});
