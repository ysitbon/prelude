/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {apply, pure}    from "./index.js";
import assert           from "assert";

export const testLaw = A => {
  const eq = (x, y) => x === y;

  it("Identity", () => {
    const x = 1 |> pure(A);
    assert.deepStrictEqual(
      identity |> pure(A) |> apply(x),
      x
    );
  });

  it("Composition", () => {
    const u = (x => x + 1) |> pure(A);
    const v = (x => x * 2) |> pure(A);
    const w = 1 |> pure(A);
    assert.deepStrictEqual(
      pipe |> pure(A) |> apply(u) |> apply(v) |> apply(w),
      v |> apply(u |> apply(w))
    );
  });

  it("Homomorphism", () => {
    const f = x => x + 1;
    const x = 1;
    assert.deepStrictEqual(
      f |> pure(A) |> apply(x |> pure(A)),
      f(x) |> pure(A)
    );
  });

  it("Interchange", () => {
    const u = (x => x + 1) |> pure(A);
    const x = 1;
    assert.deepStrictEqual(
      u |> apply(x |> pure(A)),
      (f => f(x)) |> pure(A) |> apply(u)
    );
  });
};
