/* eslint-disable no-inner-declarations*/
import {pipe}                     from "@prelude/data-function";
import {extension}                from "@prelude/data-trait";
import {Functor, map}             from "@prelude/trait-functor";
import {Applicative, apply, pure} from "@prelude/trait-applicative";
import {Monad, flatMap}           from "@prelude/trait-monad";

/**
 * @template {Monad} M
 * @template R, E
 * @param {ReaderT<M, E>} mReaderT
 * @returns {function(E): M<E>}
 */
export const runReaderT = mReaderT => env => {
  // return mReaderT.value(env);
  const readerEntry = readerCache.get(mReaderT);
  if (undefined === readerEntry) {
    const result = mReaderT.value(env);
    readerCache.set(mReaderT, new Map([[env, result]]));
    return result;
  }
  const resultCache = readerEntry.get(env);
  if (undefined === resultCache) {
    const result = mReaderT.value(env);
    readerEntry.set(env, result);
    return result;
  }
  return resultCache;
};

/**
 *
 * @param {*} M
 */
export const getReaderT = M => {
  const readerTEntry = readerTCache.get(M);
  if (!readerTEntry) {
    const result = makeReaderT(M);
    readerTCache.set(M, result);
    return result;
  }
  return readerTEntry;
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
      return ReaderT(env => env
        |> runReaderT(this)
        |> map(fn)
      );
    },

    [Applicative.pure](env) {
      return ReaderT(_ => env |> pure(M));
    },

    [Applicative.apply](readerArg) {
      return ReaderT(env => env
        |> runReaderT(this)
        |> apply(env |> runReaderT(readerArg))
      );
    },

    [Monad.flatMap](fn) {
      return ReaderT(env => env
        |> runReaderT(env
          |> runReaderT(this)
          |> flatMap(fn)
        )
      );
    }
  });

  const reader = f => ReaderT(f |> pipe(pure(M)));

  // const runReader = reader => runReaderT(reader) |> pipe(m => m.value);

  const mapReaderT = (F, fn) => mReaderT =>
    getReaderT(F).ReaderT(runReaderT(mReaderT) |> pipe(fn));

  const withReaderT = fn => readerT =>
    ReaderT(runReaderT(fn |> pipe(readerT.value)));

  const ask = ReaderT(pure(M));

  const local = withReaderT;

  return {ReaderT, mapReaderT, withReaderT, reader, ask, local};
};

const readerTCache = new WeakMap();
const readerCache = new WeakMap();
