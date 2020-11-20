/*eslint-env mocha*/
import assert                       from "assert";
import {spies}                      from "@prelude/test-spies";
import {Species, type, implSpecies} from "../lib/index.js";

describe("@prelude/trait-species", () => {
  const spy = spies();

  describe("type()", () => {
    beforeEach(() => spy.onMethod(Identity.prototype, Species.type));
    afterEach(() => spy.restore(Identity.prototype, Species.type));

    it("should call the [Species.type] symbol", () => {
      Identity(1) |> type;
      assert.ok(spy.calledOnce(Identity.prototype[Species.type]));
    });
  });

  // eslint-disable-next-line require-jsdoc
  function Identity(value) {
    if (undefined === new.target)
      return new Identity(value);
    else
      this.value = value;
  }

  implSpecies(Identity);
});
