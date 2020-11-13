/*eslint-env mocha*/
import {eq}   from "./index.js";
import assert from "assert";

export const testLaw = (x, y, z) => {
  it("Reflexivity", () => {
    assert.ok(x |> eq(x));
  });

  it("Symmetry", () => {
    assert.strictEqual(x |> eq(y), y |> eq(x));
  });

  it("Transitivity", () => {
    assert.strictEqual(x |> eq(y) && y |> eq(z), x |> eq(z));
  });
};
