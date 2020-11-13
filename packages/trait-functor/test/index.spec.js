/*eslint-env mocha*/
import {extension}              from "@prelude/data-trait";
import {Functor, map, constMap} from "../lib/index.js";
import {testLaw}                from "../lib/trait-laws.js";
import chai                     from "chai";
import sinon                    from "sinon";
import sinonChai                from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/trait-functor", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("map(fn, functor)", () => {
    const add  = sinon.spy(x => x + 1);

    beforeEach(() => sandbox.spy(Identity.prototype, Functor.map));

    it("should call the [Functor.map] symbol", () => {
      new Identity(1) |> map(add);
      expect(Identity.prototype[Functor.map]).to.have.been.calledOnce;
    });

    it("should call [fn]", () => {
      new Identity(1) |> map(add);
      expect(add).to.have.been.calledOnce;
    });

    it("should call [fn] with inner [functor] value", () => {
      new Identity(1) |> map(add);
      expect(add).to.have.been.calledOnceWith(1);
    });

    it( "should returns the computation result " +
       "wrapped into a [Functor]", () => {
      expect((new Identity(1) |> map(x => x + 1)).value).to.equal(2);
    });

    afterEach(() => add.resetHistory());
  });

  describe("constMap(value, functor)", () => {
    it("should returns a [Functor] containing the input [value]", () => {
      expect((new Identity(1) |> constMap(2)).value).to.equal(2);
    });
  });

  describe(
    "impl Array.prototype for @prelude/trait-functor",
    () => testLaw([1])
  );

  // eslint-disable-next-line require-jsdoc
  function Identity(value) {
    if (undefined === new.target)
      return new Identity(value);
    else
      this.value = value;
  }

  extension(Identity.prototype, {
    [Functor.map](fn) {
      return Identity(fn(this.value));
    }
  });
});
