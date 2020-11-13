/*eslint-env mocha*/
import assert   from "assert";
import {append} from "@prelude/trait-semigroup";
import {empty}  from "./index.js";

export const testLaw = (M, x) => {
  it("Right identity", () => {
    assert.deepStrictEqual(x |> append(M |> empty), x);
  });
  it("Left identity", () => {
    assert.deepStrictEqual(M |> empty |> append(x), x);
  });
};
