import {extension}      from "@prelude/trait";
import {curry, compose} from "@prelude/function";
import {Functor, map}   from "@prelude/functor";
import {Applicative}    from "@prelude/applicative";
import {Monad, flatMap} from "@prelude/monad";

/**
 * @template S
 * @template M
 * @template A
 * @param {(state: S) => M<[A, S]>} s 
 */
export function StateT(s) {
  if (new.target === undefined) {
    return new StateT(s);
  }
  else {
    this.value = s;
  }
}
 
extension(StateT.prototype, {
  [Functor.map](f) {
    return StateT(compose(
      map(([x, s]) => [f(x), s]), 
      runStateT(this)
    ));
  },

  [Applicative.apply](sx) {
    return StateT(compose(
      flatMap(([f, s]) => map(
        ([x, s]) => [f(x), s],
        runStateT(sx, s)
      )),
      runStateT(this)
    ));
  },

  [Monad.flatMap](k) {
    return StateT(compose(
      flatMap(([x, s]) => runStateT(k(x), s)),
      runStateT(this)
    ));
  }
});

/**
 * @template S
 * @template M
 * @template A
 * @param {StateT<S, M, A>} mstateT
 * @param {S} state
 * @return {M<[A, S]>}
 */
export const runStateT = curry((mstateT, state) => mstateT.value(state));

/**
 * 
 * @param {*} M 
 */
export const castStateT = M => {
  if (!ts.has(M)) {
    const pure  = x => StateT(s => M([x, s]));
    const state = f => StateT(compose(M, f));
    ts.set(M, {
      pure,
      state,
      get: () => state(s => ([s, s])),
      put: s => state(_ => M([{}, s])),
      modify: f => state(s => M([{}, f(s)])),
    });
  }
  return ts.get(M);
};

const ts = new WeakMap();