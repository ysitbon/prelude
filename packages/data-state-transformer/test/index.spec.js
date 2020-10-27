/*eslint-env mocha*/
import {map}                  from "@prelude/trait-functor";
import {flatMap}              from "@prelude/trait-monad";
import {Identity}             from "@prelude/data-identity";
import {getStateT, runStateT} from "../lib/index.js";
import chai                   from "chai";
import sinon                  from "sinon";
import sinonChai              from "sinon-chai";
const {expect} = chai;

describe("@prelude/state-transformer", () => {
  describe("map(fn, functor)", () => {
    const {put, get, modify} = getStateT(Identity);

    it("get", () => {
      const state = get()
        |> map(x => x + 1);
      expect(runStateT(state, 1).value)
        .to.be.deep.equal([2, 1]);
    });
    it("put", () => {
      const state = put(4);
      expect(runStateT(state, 1).value)
        .to.be.deep.equal([{}, 4]);
    });
    it("modify", () => {
      const state = modify(x => x + 1);
      expect(runStateT(state, 1).value)
        .to.be.deep.equal([{}, 2]);
    });
    it("chain1", () => {
      const state = get()
        |> map(x => x + 1)
        |> flatMap(x => put(4) |> map(_ => x));
      expect(runStateT(state, 1).value)
        .to.be.deep.equal([2, 4]);
    });
  });
});
