import {flatMap, Monad} from "../index.js";
import {testLaw} from "./trait-laws.js";
import chai      from "chai";
import sinon     from "sinon";
import sinonChai from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/monad", () => {
  describe("impl Array.prototype", () => {
    describe("flatMap(fn: (x: A) => B[], array: A[]): B[]", () => {
      const add = sinon.spy(x => [x + 1, x + 2, x + 3]);

      afterEach(() => add.resetHistory());

      it("should call the specified callback function for each items", () => {
        flatMap(add, [1, 2, 3]);
        expect(add).to.been.calledThrice;
      });

      it("should returns a new array with the mapped values", () => {
        expect(flatMap(add, [1, 2, 3]))
          .to.deep.equal([2, 3, 4, 3, 4, 5, 4, 5, 6]);
      });
    });

    describe("laws", () => testLaw(Array));
  })
});
