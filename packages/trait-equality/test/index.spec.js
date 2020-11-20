/*eslint-env mocha*/
import assert                from "assert";
import {spies}               from "@prelude/test-spies";
import {impl}                from "@prelude/data-trait";
import {Equality, eq, notEq} from "../lib/index.js";

describe("@prelude/trait-equality", () => {
  const spy = spies();

  beforeEach(() => spy.onMethod(Identity.prototype, Equality.eq));
  afterEach(() => spy.restore(Identity.prototype, Equality.eq));

  describe("eq()", () => {
    it("should call the [Equality.eq] symbol", () => {
      Identity(1) |> eq(Identity(1));
      assert.ok(spy.calledOnce(Identity.prototype[Equality.eq]));
    });

    it("should returns [true] if [x] and [y] are equal", () => {
      assert.ok(Identity(1) |> eq(Identity(1)));
    });

    it("should returns [false] if [x] and [y] are not equal", () => {
      assert.ok(!(Identity(1) |> eq(Identity(2))));
    });
  });

  describe("notEq()", () => {
    it("should call the [Equality.eq] symbol", () => {
      Identity(1) |> notEq(Identity(1));
      assert.ok(spy.calledOnce(Identity.prototype[Equality.eq]));
    });

    it("should returns [false] if [x] and [y] are equal", () => {
      assert.ok(!(Identity(1) |> notEq(Identity(1))));
    });

    it("should returns [true] if [x] and [y] are not equal", () => {
      assert.ok(Identity(1) |> notEq(Identity(2)));
    });
  });

  // eslint-disable-next-line require-jsdoc
  function Identity(value) {
    if (undefined === new.target)
      return new Identity(value);
    else
      this.value = value;
  }

  Identity |> impl(Equality, {
    [Equality.eq](other) {
      return this.value === other.value;
    }
  });
});
