/* eslint-disable no-inner-declarations*/
import {compose}            from "@prelude/data-function";
import {extension}          from "@prelude/data-trait";
import {Functor, map}       from "@prelude/trait-functor";
import {Applicative, apply} from "@prelude/trait-applicative";
import {Monad, flatMap}     from "@prelude/trait-monad";

/**
 * @template {Monad} M
 * @template R, E
 * @param {ReaderT<R, M, E>} mReaderT
 * @returns {function(E): M<E>}
 */
export const runReaderT = mReaderT => env => mReaderT.value(env);

/**
 *
 * @param {*} M
 */
export const getReaderT = M => {
  if (!ts.has(M)) {
    ts.set(M, makeReaderT(M));
  }
  return ts.get(M);
};

const makeReaderT = M => {
  /**
   * @template {Monad} M
   * @template E
   * @param {function(E): M<E>} runner
   */
  function ReaderT(runner) {
    if (new.target === undefined) {
      return new ReaderT(runner);
    }
    else {
      this.value = runner;
    }
  }

  extension(ReaderT.prototype, {
    [Functor.map](fn) {
      return ReaderT(runReaderT(this)
        |> compose(map(fn))
      );
    },

    [Applicative.pure](env) {
      return ReaderT(_ => M[Applicative.pure](env));
    },

    [Applicative.apply](readerArg) {
      return ReaderT(env => env
        |> runReaderT(this)
        |> apply(env |> runReaderT(readerArg))
      );
    },

    [Monad.flatMap](fn) {
      return ReaderT(runStateT(this)
        |> compose(flatMap(([value, state]) => state
          |> runStateT(fn.call(this, value))
        ))
      );
    }
  });

  const mapReaderT = (F, fn) => mReaderT =>
    getReaderT(F).ReaderT(runReaderT(mReaderT) |> compose(fn));

  return {ReaderT, mapReaderT};
};

const ts = new WeakMap();
