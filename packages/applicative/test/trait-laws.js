import chai             from "chai";
import {identity, pipe} from "@prelude/function";
import {apply, pure}    from "../index.js";
const {expect} = chai;

export const testLaw = A => {
  it("identity => apply(x, pure(id)) = x", () => {
    const x = pure(A, 1);
    expect(apply(x, pure(A, identity))).to.be.deep.equal(x);
  });

  it("composition: pure(pipe) |> apply(u) |> apply(v) |> apply(w)" +
    " = w |> apply(v |> apply(u))", () => {
    const u = pure(A, x => x + 1);
    const v = pure(A, x => x * 2);
    const w = pure(A, 1);
    expect(pipe(apply(u), apply(v), apply(w))(pure(A, pipe)))
      .to.be.deep.equal(apply(apply(w, u), v));
  });

  it("homomorphism: pure(f) |> apply(pure(x)) = pure(f x)", () => {
    const f = x => x + 1;
    const x = 1;
    expect(apply(pure(A, x), pure(A, f)))
      .to.be.deep.equal(pure(A, f(x)));
  });

  it("interchange: u |> apply(pure(x)) = pure(f => f(x)) |> apply(u)", () => {
    const u = pure(A, x => x + 1);
    const x = 1;
    expect(apply(pure(A, x), u))
      .to.be.deep.equal(apply(u, pure(A, f => f(x))));
  });
}
