import {curry}       from "@prelude/function";
import {Functor}     from "@prelude/functor";
import {Applicative} from "@prelude/applicative";
import {Monad}       from "@prelude/monad";

/**
 * @template M
 * @template V
 * @template S
 * @param {(state: S) => M<[V, S]>} s 
 */
function StateT(s) {
  if (new.target === undefined) {
    return new StateT(s);
  }
  else {
    // s -> m (a, s)
    this.run = s;
  }
}
  
const runStateT = curry((ms, s) => ms.run(s));
  
  const pure = (m, s) => StateT(s => m([x, s]));
  
extension(StateT.prototype, {
  [Functor.map](f) {
    return StateT(compose(
      map(([x, s]) => [f(x), s]), 
      runStateT(this)
    ));
  },

  [Applicative.apply](sx) {
    return StateT(compose(
      bind(([f, s]) => map(
        ([x, s]) => [f(x), s],
        runStateT(sx, s)
      )),
      runStateT(this)
    ));
  },

  [Monad.bind](k) {
    return StateT(compose(
      bind(([x, s]) => runStateT(k(x), s)),
      runStateT(this)
    ));
  }
});

// TODO: Invalid implementation. Need to found a way to inject 
// target monad constructor to pure() without passing it by arg
const state = f => StateT(compose(pure, f));

const get = () => state(s => [s, s]);

const put = s => state(_ => [undefined, s]);

const modify = f => state(s => [undefined, f(s)]);

const evalStateT = curry((s, m) => m.run(s)[0]);

const execStateT = curry((s, m) => m.run(s)[1]);
  