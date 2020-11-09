/*eslint-env mocha*/
import {identity, pipe} from "@prelude/data-function";
import {apply, pure}    from "./index.js";
import assert           from "assert";

export const testLaw = A => {
  const eq = (x, y) => x === y;

  it("Identity", () => {
    const x = 1 |> pure(A);
    assert.ok(eq(
      identity |> pure(A) |> apply(x),
      x
    ));
  });

  it("Composition", () => {
    const u = (x => x + 1) |> pure(A);
    const v = (x => x * 2) |> pure(A);
    const w = 1 |> pure(A);
    assert.ok(eq(
      pipe |> pure(A) |> apply(u) |> apply(v) |> apply(w),
      u |> apply(w) |> apply(v)
    ));
  });

  it("Homomorphism", () => {
    const f = x => x + 1;
    const x = 1;
    assert.ok(eq(
      f |> pure(A) |> apply(x |> pure(A)),
      f(x) |> pure(A)
    ));
  });

  it("Interchange", () => {
    const u = pure(A, x => x + 1);
    const x = 1;
    assert.ok(eq(
      u |> apply(x |> pure(A)),
      (f => f(x)) |> pure(A) |> apply(u)
    ));
  });
};
