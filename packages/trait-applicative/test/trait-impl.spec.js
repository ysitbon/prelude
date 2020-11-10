/*eslint-env mocha*/
import {apply, pure}  from "../lib/index.js";
import {testLaw}      from "../lib/trait-laws.js";
import chai           from "chai";
import sinon          from "sinon";
import sinonChai      from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("impl Array.prototype for @prelude/trait-applicative", () => {
  describe("apply(functor, applicative)", () => {
    const add = sinon.spy(x => x + 1);

    it("should call the [Applicative.apply] symbol for each items", () => {
      [add, add, add] |> apply([1, 2, 3]);
      expect(add).to.have.been.calledThrice;
    });

    it("should returns a new array with the result " +
       "of the applied functions", () => {
      expect([add, add, add] |> apply([1, 2, 3]))
        .to.deep.equal([2, 3, 4]);
    });
  });

  describe("pure(FunctorConstructor, value)", () => {
    it("should box the passed [value] into a new array", () => {
      expect(1 |> pure(Array)).to.deep.equal([1]);
    });
  });

  describe("Applicative laws", () => {
    testLaw(Array);
  });
});
