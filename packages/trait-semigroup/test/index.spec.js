/*eslint-env mocha*/
import assert              from "assert";
import {impl}              from "@prelude/data-trait";
import {spies}             from "@prelude/test-spies";
import {Semigroup, append} from "../lib/index.js";

describe("@prelude/trait-semigroup", () => {
  const spy = spies();

  describe("append()", () => {
    beforeEach(() => spy.onMethod(List.prototype, Semigroup.append));
    afterEach(() => spy.restore(List.prototype, Semigroup.append));

    it("should call the [Semigroup.append] symbol", () => {
      List(1, 2, 3) |> append(List(4, 5, 6));
      assert.ok(spy.calledOnce(List.prototype[Semigroup.append]));
    });

    it("should returns the results of the associativity", () => {
      assert.deepStrictEqual(
        List(1, 2, 3) |> append(List(4, 5, 6)),
        List(1, 2, 3, 4, 5, 6)
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
    [Semigroup.append](list) {
      return List(...this.values, ...list.values);
    }
  });
});
