/* eslint-disable no-inner-declarations*/
import {curry, compose} from "@prelude/data-function";
import {extension}      from "@prelude/data-trait";
import {Functor, map}   from "@prelude/trait-functor";
import {Applicative}    from "@prelude/trait-applicative";
import {Monad, flatMap} from "@prelude/trait-monad";

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @param {S} state
 * @returns {M<[A, S]>}
 */
const runStateT_ = (mStateT, state) => mStateT.value(state);
export const runStateT = curry(runStateT_);

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @param {S} state
 * @return {M<A>}
 */
const evalStateT_ = (mStateT, state) =>
  map(([_, s]) => s, runStateT_(mStateT, state));
export const evalStateT = curry(evalStateT_);

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @param {S} state
 * @return {M<A>}
 */
const execStateT_ = (mStateT, state) =>
  map(([a, _]) => a, runStateT_(mStateT, state));
export const execStateT = curry(execStateT_);

/**
 *
 * @param {*} M
 */
export const getStateT = M => {
  if (!ts.has(M)) {
    ts.set(M, makeStateT(M));
  }
  return ts.get(M);
};

const makeStateT = M => {
  /**
   * @template {Monad} M
   * @template A, S
   * @param {function(S): M<[A, S]>} runner
   */
  function StateT(runner) {
    if (new.target === undefined) {
      return new StateT(runner);
    }
    else {
      this.value = runner;
    }
  }

  extension(StateT.prototype, {
    [Functor.map](f) {
      return StateT(compose(
        map(([x, s]) => [f(x), s]),
        runStateT(this)
      ));
    },

    [Applicative.pure](x) {
      return StateT(s => M([x, s]));
    },

    [Applicative.apply](sx) {
      return StateT(compose(
        flatMap(([f, s]) => map(
          ([x, s]) => [f(x), s],
          runStateT_(sx, s)
        )),
        runStateT(this)
      ));
    },

    [Monad.flatMap](k) {
      return StateT(compose(
        flatMap(([x, s]) => runStateT_(k(x), s)),
        runStateT(this)
      ));
    }
  });

  const state = f => StateT(compose(M, f));
  const get = () => state(s => ([s, s]));
  const put = s => state(_ => ([{}, s]));
  const modify = f => state(s => ([{}, f(s)]));

  return {StateT, state, get, put, modify};
};

const ts = new WeakMap();
