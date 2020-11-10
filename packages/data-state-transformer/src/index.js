/* eslint-disable no-inner-declarations*/
import {compose} from "@prelude/data-function";
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
export const runStateT = mStateT => state => mStateT.value(state);

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @param {S} state
 * @return {M<A>}
 */
export const evalStateT = mStateT => state => state
  |> runStateT(mStateT)
  |> map(([_, s]) => s);

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @param {S} state
 * @return {M<A>}
 */
export const execStateT = mStateT => state => state
  |> runStateT(mStateT)
  |> map(([a, _]) => a);


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
    [Functor.map](fn) {
      return StateT(runStateT(this)
        |> compose(map(([value, state]) => [fn.call(this, value), state]))
      );
    },

    [Applicative.pure](value) {
      return StateT(state => M([value, state]));
    },

    [Applicative.apply](valueArg) {
      return StateT(runStateT(this)
        |> compose(flatMap(([fn, state]) => state
          |> runStateT(valueArg)
          |> map(([value, state]) => [fn(value), state])
        ))
      );
    },

    [Monad.flatMap](fn) {
      return StateT(runStateT(this)
        |> compose(flatMap(([value, state]) => state
          |> runStateT(fn.call(this, value))
        ))
      );
    }
  });

  const state = fn => StateT(fn |> compose(M));
  const get = () => state(s => ([s, s]));
  const put = s => state(_ => ([{}, s]));
  const modify = fn => state(s => ([{}, fn(s)]));

  return {StateT, state, get, put, modify};
};

const ts = new WeakMap();
