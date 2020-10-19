import chai             from "chai";
import {identity, pipe} from "@prelude/function";
import {apply, pure}    from "../index.js";
const {expect} = chai;

export const testLaw = (A, applicative, functor) => {
  it("identity => apply(x, pure(id)) = x", () => {
    expect(apply(functor, pure(A, identity))).to.be.deep.equal(functor);
  });

  it("composition: pure(pipe) |> apply(u) |> apply(v) |> apply(w)" +
    " = w |> apply(v |> apply(u))", () => {
    const addA = pure(A, x => x + 1);
    const mulA = pure(A, x => x * 2);
    const valF = pipe(
      apply(addA),
      apply(mulA),
      apply(functor)
    )(pure(A, pipe));
    expect(valF).to.be.deep.equal(apply(apply(functor, addA), mulA));
  });

  it("homomorphism: pure(f) |> apply(pure(x)) = pure(f x)", () => {
    const fn = x => x + 1;
    const value = 1;
    expect(apply(pure(A, value), pure(A, fn)))
      .to.be.deep.equal(pure(A, fn(value)));
  });
}
