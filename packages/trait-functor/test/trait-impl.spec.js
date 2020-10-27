/*eslint-env mocha*/
import {map, constMap} from "../lib/index.js";
import {testLaw}       from "../lib/trait-laws.js";
import chai            from "chai";
import sinon           from "sinon";
import sinonChai       from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/functor", () => {
  describe("impl Array.prototype", () => {
    describe("map(fn, array)", () => {
      const add  = sinon.spy(x => x + 1);

      it("should call [fn] for each items of the [array]", () => {
        map(add, [1, 2, 3]);
        expect(add).to.have.been.calledThrice;
      });

      it("should returns a new array containing " +
         "the results of [fn] calls", () => {
        expect(map(add, [1, 2, 3])).to.deep.equal([2, 3, 4]);
      });

      after(() => add.resetHistory());
    });

    describe("constMap(value, array)", () => {
      it("should returns a new array containing " +
         "the input [value] for each items", () => {
        expect(constMap(4, [1, 2, 3])).to.deep.equal([4, 4, 4]);
      });
    });

    describe("laws", () => testLaw([1, 2, 3]));
  });
});
