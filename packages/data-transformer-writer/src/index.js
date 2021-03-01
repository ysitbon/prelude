/* eslint-disable no-inner-declarations*/
import {pipe}                     from "@prelude/data-function";
import {impl}                     from "@prelude/data-trait";
import {Functor, map}             from "@prelude/trait-functor";
import {Applicative, pure, liftA} from "@prelude/trait-applicative";
import {Monad, flatMap}           from "@prelude/trait-monad";
import {empty}                    from "@prelude/trait-monoid";
import {append}                   from "@prelude/trait-semigroup";

/**
 * @template {Monad} KMonad
 * @template TResult, TOutput
 * @param {WriterT<TOutput, KMonad, TResult>} writerT
 * The writer transformer reference to consume.
 *
 * @returns {KMonad<[TResult, TOutput]>}
 * Returns a monad combining the result and the sum of all outputs.
 */
export const runWriterT = writerT => writerT.value;

/**
 * Gets a writer transformer for a specific kind of monad.
 *
 * @template {Monad} KMonad
 * @template TResult, TOutput
 * @param {KMonad} MonadConstructor
 * Reference to the monad constructor.
 *
 * @returns {Constructor<WriterT>}
 */
export const getWriterT = MonadConstructor => {
  const writer = writers.get(MonadConstructor);
  if (undefined === writer) {
    const newWriter = makeWriterT(MonadConstructor);
    writers.set(MonadConstructor, newWriter);
    return newWriter;
  }
  return writer;
};

/**
 * Builds a writer transformer implementation for a specific kind of monad.
 *
 * @return {ImplWriterT}
 * Returns the implemented transformer interface.
 */
const makeWriterT = M => {
  /**
   * @template {Monad} M
   * @template TResult, TOutput
   * @param {M<[TResult, TOutput]>} runner
   */
  function WriterT(runner) {
    if (new.target === undefined) {
      return new WriterT(runner);
    }
    else {
      this.value = runner;
    }
  }

  WriterT |> impl(Functor, {
    [Functor.map](fn) {
      return WriterT(runWriterT(this) |> map(fn));
    }
  });

  WriterT |> impl(Applicative, {
    [Applicative.pure](initialResult, MonoidConstructor) {
      return WriterT(
        [initialResult, MonoidConstructor |> empty] |> pure(M)
      );
    },
    [Applicative.apply](writerArg) {
      return WriterT([runWriterT(this), runWriterT(writerArg)]
        |> liftA(([fn, outputA], [arg, outputB]) => [
          fn(arg),
          outputA |> append(outputB)
        ])
      );
    }
  });

  WriterT |> impl(Monad, {
    [Monad.flatMap](fn) {
      return WriterT(runWriterT(this)
        |> flatMap(([resultA, outputA]) => runWriterT(fn(resultA))
          |> map(([resultB, outputB]) => [
            resultB,
            outputA |> append(outputB)
          ])
        )
      );
    }
  });

  /**
   * Extract the output from a writer computation.
   *
   * @param writerT
   */
  const execWriterT = writerT =>
    runWriterT(writerT) |> map(([_, output]) => output);

  /**
   * Maps a writer monad into a new kind of writer monad.
   *
   * @param MonadConstructor
   * The monad constructor to map into.
   *
   * @param fn
   * @return {function(*=): WriterT}
   */
  const mapWriterT = (MonadConstructor, fn) => writerT => {
    const {WriterT} = getWriterT(MonadConstructor);
    return WriterT(runWriterT(writerT) |> pipe(fn));
  };

  /** @typedef ImplWriterT */
  return {WriterT, execWriterT, mapWriterT};
};

const writers = new WeakMap();
