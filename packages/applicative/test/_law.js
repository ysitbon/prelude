import chai             from "chai";
import {identity, pipe} from "@prelude/function";
import {apply, pure}    from "../index.js";
const {expect} = chai;

export const testLaw = (ApplicativeConstructor, applicative, functor) => {
    describe("laws", () => {
        it("identity => apply(x, pure(id)) = x", () => {
            expect(apply(functor, pure(ApplicativeConstructor, identity)))
                .to.be.deep.equal(functor);
        });
        it("composition: pipe(pure(pipe), apply(u), apply(v), apply(w))" +
            " = pipe(u, apply(pipe(v, apply(w)))", () => {
            const add1 = x => x + 1;
            const mul2 = x => x * 2;
            expect(pipe(apply(add1), apply(mul2), apply(functor))(pure(ApplicativeConstructor, pipe)))
                .to.be.deep.equal(apply(apply(functor, add1), mul2));
        });
    });
}
