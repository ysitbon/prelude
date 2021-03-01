/* eslint-disable no-inner-declarations*/
import {pipe}           from "@prelude/data-function";
import {impl}           from "@prelude/data-trait";
import {Functor, map}   from "@prelude/trait-functor";
import {Applicative}    from "@prelude/trait-applicative";
import {Monad, flatMap} from "@prelude/trait-monad";

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @returns {function(S): M<[A, S]>}
 */
export const runStateT = mStateT => state => mStateT.value(state);

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @returns {function(S): M<A>}
 */
export const evalStateT = mStateT => state => state
  |> runStateT(mStateT)
  |> map(([_, s]) => s);

/**
 * @template {Monad} M
 * @template A, S
 * @param {StateT<S, M, A>} mStateT
 * @return {function(S): M<A>}
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

  const state = fn => StateT(fn |> pipe(M));
  const get = () => state(s => ([s, s]));
  const put = s => state(_ => ([{}, s]));
  const modify = fn => state(s => ([{}, fn(s)]));

  //////////////////////////////////////////////////////////////////////////////
  /// Implementations
  //////////////////////////////////////////////////////////////////////////////

  StateT |> impl(Functor, {
    [Functor.map](fn) {
      return StateT(runStateT(this)
        |> pipe(map(([value, state]) => [fn(value), state]))
      );
    }
  });

  StateT |> impl(Applicative, {
    [Applicative.pure](value) {
      return StateT(state => M([value, state]));
    },

    [Applicative.apply](valueArg) {
      return StateT(runStateT(this)
        |> pipe(flatMap(([fn, state]) => state
          |> runStateT(valueArg)
          |> map(([value, state]) => [fn(value), state])
        ))
      );
    }
  });

  StateT |> impl(Monad, {
    [Monad.flatMap](fn) {
      return StateT(runStateT(this)
        |> pipe(flatMap(([value, state]) => state
          |> runStateT(fn(value))
        ))
      );
    }
  });

  return {StateT, state, get, put, modify};
};

/**
 * Internal cache to constructed StateT.
 *
 * @template T
 * @template {StateT} ST
 * @type {WeakMap<T, ST>}
 */
const ts = new WeakMap();
