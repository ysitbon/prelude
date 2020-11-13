/*eslint-env mocha*/
import {append} from "./index.js";
import assert   from "assert";

export const testLaw = (x, y, z) => {
  it("Associativity", () => {
    assert.deepStrictEqual(
      x |> append(y |> append(z)),
      x |> append(y) |> append(z)
    );
  });
};
