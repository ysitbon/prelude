import chai                          from "chai";
import {resetSpy, restoreSpy, spyFn} from "@prelude/test-spies";
import {apply, pure}                 from "../index.js";
import {testLaw}                     from "./_law.js";
const {expect} = chai;

describe("@prelude/applicative", () => {
  describe("impl Array.prototype", () => {
    describe("apply(functor: A[], applicative: ((x: A) => B>)[]: B[]", () => {
      const [spy, add] = spyFn(x => x + 1);
      beforeEach(() => resetSpy(spy));

      it("should call the [Applicative.apply] symbol for each items", () => {
        apply([1, 2, 3], [add, add, add]);
        expect(spy.calls).to.deep.equal([
          {args:[1],returns:2},
          {args:[2],returns:3},
          {args:[3],returns:4}
        ]);
      });

      it("should returns a new array with the result of the applied functions", () => {
        expect(apply([1, 2, 3], [add, add, add])).to.deep.equal([2, 3, 4]);
      });

      after(() => restoreSpy(spy));
    });

    describe("pure(x: A): A[]", () => {
      it("should box the passed value into an array", () => {
        expect(pure(Array, 1)).to.deep.equal([1]);
      });
    });

    describe("laws", () => {
      testLaw(Array, [x => x + 1], [1]);
    });
  })
});
