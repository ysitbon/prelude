/*eslint-env mocha*/
import {apply, pure}  from "../index.js";
import {testLaw}      from "./trait-laws.js";
import chai           from "chai";
import sinon          from "sinon";
import sinonChai      from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/applicative", () => {
  describe("impl Array.prototype", () => {
    describe("apply(functor, applicative)", () => {
      const add = sinon.spy(x => x + 1);

      it("should call the [Applicative.apply] symbol for each items", () => {
        apply([1, 2, 3], [add, add, add]);
        expect(add).to.have.been.calledThrice;
      });

      it("should returns a new array with the result " +
         "of the applied functions", () => {
        expect(apply([1, 2, 3], [add, add, add]))
          .to.deep.equal([2, 3, 4]);
      });
    });

    describe("pure(FunctorConstructor, value)", () => {
      it("should box the passed [value] into a new array", () => {
        expect(pure(Array, 1)).to.deep.equal([1]);
      });
    });

    describe("laws", () => {
      testLaw(Array, [x => x + 1], [1]);
    });
  });
});
