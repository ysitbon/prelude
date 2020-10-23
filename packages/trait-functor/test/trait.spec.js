/*eslint-env mocha*/
import {extension}              from "@prelude/data-trait";
import {Functor, map, constMap} from "../index.js";
import chai                     from "chai";
import sinon                    from "sinon";
import sinonChai                from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/functor", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("map(fn, functor)", () => {
    const add  = sinon.spy(x => x + 1);

    beforeEach(() => sandbox.spy(Identity.prototype, Functor.map));

    it("should call the [Functor.map] symbol", () => {
      map(add, new Identity(1));
      expect(Identity.prototype[Functor.map]).to.have.been.calledOnce;
    });

    it("should call [fn]", () => {
      map(add, new Identity(1));
      expect(add).to.have.been.calledOnce;
    });

    it("should call [fn] with inner [functor] value", () => {
      map(add, new Identity(1));
      expect(add).to.have.been.calledOnceWith(1);
    });

    it( "should returns the computation result " +
       "wrapped into a [Functor]", () => {
      map(add, new Identity(1));
      expect(map(x => x + 1, new Identity(1)).value).to.equal(2);
    });

    afterEach(() => add.resetHistory());
  });

  describe("constMap(value, functor)", () => {
    it("should returns a [Functor] containing the input [value]", () => {
      expect(constMap(2, new Identity(1)).value).to.equal(2);
    });
  });

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
