/*eslint-env mocha*/
import {Identity}       from "../lib/index.js";
import * as functor     from "@prelude/trait-functor/lib/laws.js";
import * as applicative from "@prelude/trait-applicative/lib/laws.js";
import * as monad       from "@prelude/trait-monad/lib/laws.js";

describe("@prelude/data-identity", () => {
  describe(
    "impl Identity.prototype for @prelude/functor",
    () => functor.testLaw(Identity(1))
  );
  describe(
    "impl Identity.prototype for @prelude/applicative",
    () => applicative.testLaw(Identity)
  );
  describe(
    "impl Identity.prototype for @prelude/monad",
    () => monad.testLaw(Identity)
  );
});
