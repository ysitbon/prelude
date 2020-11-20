/*eslint-env mocha,es6*/
/*eslint-disable require-jsdoc*/
import {trait, impl, deriving} from "../lib/index.js";
import assert                  from "assert";

describe("@prelude/data-trait", () => {
  describe("trait()", () => {
    const key1 = Symbol();
    const key2 = Symbol();
    const Kind1 = trait({key1});
    const Kind2 = trait({[deriving]: [Kind1], key2});

    it("should copy symbols", () => {
      assert.strictEqual(Kind1.key1, key1);
    });
    it("should contains [deriving] traits", () => {
      assert.deepStrictEqual(Kind2[deriving], [Kind1]);
    });
  });

  describe("impl()", () => {
    const key1 = Symbol();
    const key2 = Symbol();
    const Kind1 = trait({key1});
    const Kind2 = trait({[deriving]: [Kind1], key2});
    const desc1 = {[key1]() {}};
    const desc2 = {[key2]() {}};

    it("should throws an implementation error if missing "
      + "implementation in descriptor", () => {
      function Target() {}
      assert.throws(() => Target |> impl(Kind1, {}));
    });
    it("should throws an implementation error if missing "
      + "deriving not implemented in target", () => {
      function Target() {}
      assert.throws(() => Target |> impl(Kind2, desc2));
    });

    it("should not throw any errors correctly implemented", () => {
      function Target() {}
      assert.doesNotThrow(() => {
        Target |> impl(Kind1, desc1);
        Target |> impl(Kind2, desc2);
      });
    });
  });
});
