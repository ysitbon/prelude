/*eslint-env mocha*/
import {extension}     from "@prelude/data-trait";
import {Monoid, empty} from "../src/index.js";
import chai            from "chai";
import sinon           from "sinon";
import sinonChai       from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/trait-monoid", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("empty()", () => {
    beforeEach(() => sandbox.spy(List.prototype, Monoid.empty));

    it("should call the [Monoid.empty] symbol", () => {
      List |> empty;
      expect(List.prototype[Monoid.empty]).to.have.been.calledOnce;
    });

    it("should returns the empty representation", () => {
      expect(List |> empty).to.deep.equal(List());
    });
  });

  // eslint-disable-next-line require-jsdoc
  function List(...values) {
    if (undefined === new.target)
      return new List(...values);
    else {
      this.values = [...values];
    }
  }

  extension(List.prototype, {
    [Monoid.empty]() {
      return List();
    }
  });
});
