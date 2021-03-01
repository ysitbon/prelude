/* eslint-disable no-inner-declarations*/
import {pipe}                     from "@prelude/data-function";
import {impl}                     from "@prelude/data-trait";
import {Functor, map}             from "@prelude/trait-functor";
import {Applicative, pure, liftA} from "@prelude/trait-applicative";
import {Monad, flatMap}           from "@prelude/trait-monad";
import {empty}                    from "@prelude/trait-monoid";
import {append}                   from "@prelude/trait-semigroup";

/**
 * @template {Monad} M
 * @template R, E
 * @param {WriterT<M, E>} writerT
 * @returns {function(E): M<E>}
 */
export const runWriterT = writerT => writerT.value;

/**
 *
 * @param {*} M
 */
export const getWriterT = M => {
  const writer = writers.get(M);
  if (undefined === writer) {
    const newWriter = makeWriterT(M);
    writers.set(M, newWriter);
    return newWriter;
  }
  return writer;
};

const makeWriterT = M => {
  /**
   * @template {Monad} M
   * @template TResult, TOutput
   * @param {function(): M<[TResult, TOutput]>} runner
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
  const mapWriterT = (MonadConstructor, fn) => writerT =>
    getWriterT(MonadConstructor).WriterT(runWriterT(writerT) |> pipe(fn));

  return {WriterT, execWriterT, mapWriterT};
};

const writers = new WeakMap();
