/*eslint-env mocha*/
import assert    from "assert";
import {pure}    from "@prelude/trait-applicative";
import {flatMap} from "..";

export const testLaw = M => {
  it("Left identity", () => {
    const f = x => (x + 1) |> pure(M);
    const x = 1;

    assert.deepStrictEqual(
      x |> pure(M) |> flatMap(f),
      f(x)
    );
  });

  it("Right identity", () => {
    const m = 1 |> pure(M);
    assert.deepStrictEqual(
      m |> flatMap(pure(M)),
      m
    );
  });

  it("Associativity", () => {
    const m = 1 |> pure(M);
    const k = x => (x + 1) |> pure(M);
    const h = x => (x * 2) |> pure(M);
    assert.deepStrictEqual(
      m |> flatMap(x => k(x) |> flatMap(h)),
      m |> flatMap(k) |> flatMap(h)
    );
  });
};
