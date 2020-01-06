import {curry}       from "@prelude/function";
import {Functor}     from "@prelude/functor";
import {Applicative} from "@prelude/applicative";
import {Monad}       from "@prelude/monad";

/**
 * @template S
 * @template M
 * @template A
 * @param {(state: S) => M<[A, S]>} s 
 */
function StateT(m, s) {
  if (new.target === undefined) {
    return new StateT(s);
  }
  else {
    // s -> m (a, s)
    this.value = s;
  }
}
  
/**
 * @template S
 * @template M
 * @template A
 * @param {StateT<S, M, A>} mtrans
 * @param {S} state
 * @return {M<[A, S]>}
 */
const runStateT = curry((ms, s) => ms.value(s));
  
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
const state = (m, f) => StateT(compose(pure(m), f));

const get = m => state(s => m([s, s]));

const put = (m, s) => state(_ => m([{}, s]));

const modify = (m, f) => state(s => m([{}, f(s)]));

const evalStateT = curry((s, m) => m.value(s)[0]);

const execStateT = curry((s, m) => m.value(s)[1]);
  