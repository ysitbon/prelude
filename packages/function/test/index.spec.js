import {curry, compose, identity, flip, constant, until} from "../";
import {default as chai} from "chai";
const {expect} = chai;

describe("@prelude/function", () => {
  it("identity()", () => {
    expect(identity("helloworld!")).to.equal("helloworld!");
  });

  it("curry()", () => {
    const sum = curry((x, y, z) => x + y + z);
    expect(sum("hello", "world", "!")).to.equal("helloworld!");
    expect(sum("hello")("world", "!")).to.equal("helloworld!");
    expect(sum("hello", "world")("!")).to.equal("helloworld!");
    expect(sum("hello")("world")("!")).to.equal("helloworld!");
  });

  it("compose()", () => {
    const f = x => x + '!';
    const g = y => y + 'world';
    const h = compose(f, g);
    expect(h('hello')).to.equal("helloworld!");
  });

  it("flip()", () => {
    const f = (x, y) => x + y;
    const g = flip(f);
    expect(g("hello", "world")).to.equal("worldhello");
  });

  it("constant()", () => {
    const f = constant("helloworld!");
    expect(f("goodbye!")).to.equal("helloworld!");
  });

  it("until()", () => {
    const f = until(
      cs => cs.charAt(0) === "h",
      cs => cs.slice(1)
    );
    expect(f("goodbye!helloworld!")).to.equal("helloworld!");
  });
});
