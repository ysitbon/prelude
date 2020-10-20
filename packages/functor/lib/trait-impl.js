import {extension} from "@prelude/trait";
import {Functor}   from "./trait.js";

extension(Array.prototype, {
  [Functor.map](f) {
    const xs = [];
    const l  = this.length;
    for (let i = 0; i < l; ++i) xs.push(f(this[i]));
    return xs;
  }
});
