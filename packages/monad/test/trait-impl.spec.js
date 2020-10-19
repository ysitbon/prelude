import chai                          from "chai";
import {spyFn, resetSpy, restoreSpy} from "@prelude/test-spies";
import {flatMap}                     from "../index.js";
import {testLaw}                     from "./trait-laws.js";
const {expect} = chai;

describe("@prelude/monad", () => {
  describe("impl Array.prototype", () => {
    describe("flatMap(fn: (x: A) => B[], array: A[]): B[]", () => {
      const [spy, add] = spyFn(x => [x + 1, x + 2, x + 3]);
      beforeEach(() => resetSpy(spy));

      it("should call the [Monad.flatMap] symbol for each items", () => {
        flatMap(add, [1, 2, 3]);
        expect(spy.calls).to.deep.equal([
          {args:[1],returns:[2, 3, 4]},
          {args:[2],returns:[3, 4, 5]},
          {args:[3],returns:[4, 5, 6]}
        ]);
      });

      it("should returns a new array with the mapped values", () => {
        expect(flatMap(add, [1, 2, 3]))
          .to.deep.equal([2, 3, 4, 3, 4, 5, 4, 5, 6]);
      });

      after(() => restoreSpy(spy));
    });

    describe("laws", () => testLaw(Array));
  })
});
