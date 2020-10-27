/*eslint-env mocha*/
import {flatMap} from "../lib/index.js";
import {testLaw} from "../lib/trait-laws.js";
import chai      from "chai";
import sinon     from "sinon";
import sinonChai from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/monad", () => {
  describe("impl Array.prototype", () => {
    describe("flatMap(fn, array)", () => {
      const add = sinon.spy(x => [x + 1, x + 2, x + 3]);

      afterEach(() => add.resetHistory());

      it("should call [fn] for each items of [array]", () => {
        flatMap(add, [1, 2, 3]);
        expect(add).to.been.calledThrice;
      });

      it("should returns all computation results concatenated " +
         "into a new [Array]", () => {
        expect(flatMap(add, [1, 2, 3]))
          .to.deep.equal([2, 3, 4, 3, 4, 5, 4, 5, 6]);
      });
    });

    describe("laws", () => testLaw(Array));
  });
});
