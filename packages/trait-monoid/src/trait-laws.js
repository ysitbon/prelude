/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {map}            from "./index.js";
import assert           from "assert";
import {append} from "../../trait-semigroup/src";

export const testLaw = (x, y, z) => {
  it("Associativity", () => {
    assert.deepStrictEqual(
      x |> append(y |> append(z)),
      x |> append(y) |> append(z)
    );
  });
};
