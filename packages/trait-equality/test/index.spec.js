/*eslint-env mocha*/
import {extension}           from "@prelude/data-trait";
import {Equality, eq, notEq} from "../lib/index.js";
import chai                  from "chai";
import sinon                 from "sinon";
import sinonChai             from "sinon-chai";
const {expect} = chai;
chai.use(sinonChai);

describe("@prelude/trait-equality", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => sandbox.restore());

  describe("eq()", () => {
    beforeEach(() => sandbox.spy(Identity.prototype, Equality.eq));

    it("should call the [Equality.eq] symbol", () => {
      Identity(1) |> eq(Identity(1));
      expect(Identity.prototype[Equality.eq]).to.have.been.calledOnce;
    });

    it("should returns [true] if [x] and [y] are equal", () => {
      expect(Identity(1) |> eq(Identity(1))).to.be.true;
    });

    it("should returns [false] if [x] and [y] are not equal", () => {
      expect(Identity(1) |> eq(Identity(2))).to.be.false;
    });
  });

  describe("notEq()", () => {
    beforeEach(() => sandbox.spy(Identity.prototype, Equality.eq));

    it("should call the [Equality.eq] symbol", () => {
      Identity(1) |> notEq(Identity(1));
      expect(Identity.prototype[Equality.eq]).to.have.been.calledOnce;
    });

    it("should returns [false] if [x] and [y] are equal", () => {
      expect(Identity(1) |> notEq(Identity(1))).to.be.false;
    });

    it("should returns [true] if [x] and [y] are not equal", () => {
      expect(Identity(1) |> notEq(Identity(2))).to.be.true;
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
    [Equality.eq](other) {
      return this.value === other.value;
    }
  });
});
