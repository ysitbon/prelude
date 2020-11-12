/*eslint-env mocha*/
import "../src/index.js";
import * as functor     from "@prelude/trait-functor/lib/trait-laws.js";
import * as applicative from "@prelude/trait-applicative/lib/trait-laws.js";
import * as monad       from "@prelude/trait-monad/lib/trait-laws.js";

describe("@prelude/data-array", () => {
  describe(
    "impl Array.prototype for @prelude/trait-functor",
    () => functor.testLaw([1])
  );
  describe(
    "impl Array.prototype for @prelude/trait-applicative",
    () => applicative.testLaw(Array)
  );
  describe(
    "impl Array.prototype for @prelude/trait-monad",
    () => monad.testLaw(Array)
  );
});
