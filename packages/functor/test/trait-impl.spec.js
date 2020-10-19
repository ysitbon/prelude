import {map, constMap} from "../index.js";
import {testLaw}       from "./trait-laws.js";
import chai            from "chai";
import sinon           from "sinon";
import sinonChai       from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/functor", () => {
  describe("impl Array.prototype", () => {
    describe("map(fn: (x: A) => B, scope: Array<A>): Array<B>", () => {
      const add  = sinon.spy(x => x + 1);

      it("should call the specified callback for each items", () => {
        map(add, [1, 2, 3]);
        expect(add).to.have.been.calledThrice;
      });

      it("should returns a new array with the mapped values", () => {
        expect(map(add, [1, 2, 3])).to.deep.equal([2, 3, 4]);
      });

      after(() => add.resetHistory());
    });

    describe("constMap(value: B, scope: Array<A>): Array<B>", () => {
      it("should returns a new array with the passed value set for each items", () => {
        expect(constMap(4, [1, 2, 3])).to.deep.equal([4, 4, 4]);
      });
    });

    describe("laws", () => testLaw([1, 2, 3]));
  })
});