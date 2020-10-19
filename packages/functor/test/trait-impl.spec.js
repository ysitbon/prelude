import chai                          from "chai";
import {spyFn, resetSpy, restoreSpy} from "@prelude/test-spies";
import {testLaw}                     from "./trait-laws.js";
import {map, constMap}               from "../index.js";
const {expect} = chai;

describe("@prelude/functor", () => {
  describe("impl Array.prototype", () => {
    describe("map(fn: (x: A) => B, scope: Array<A>): Array<B>", () => {
      const [spy, add] = spyFn(x => x + 1);
      beforeEach(() => resetSpy(spy));

      it("should call the [Functor.map] symbol for each items", () => {
        map(add, [1, 2, 3]);
        expect(spy.calls).to.deep.equal([
          {args:[1],returns:2},
          {args:[2],returns:3},
          {args:[3],returns:4}
        ]);
      });

      it("should returns a new array with the mapped values", () => {
        expect(map(add, [1, 2, 3])).to.deep.equal([2, 3, 4]);
      });

      after(() => restoreSpy(spy));
    });

    describe("constMap(value: B, scope: Array<A>): Array<B>", () => {
      it("should returns a new array with the passed value set for each items", () => {
        expect(constMap(4, [1, 2, 3])).to.deep.equal([4, 4, 4]);
      });
    });

    describe("laws", () => testLaw([1, 2, 3]));
  })
});