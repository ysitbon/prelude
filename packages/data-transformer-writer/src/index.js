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
 * @returns {WriterTImpl}
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
 * @return {WriterTImpl}
 * Returns the implemented transformer interface.
 */
const makeWriterT = MonadConstructor => {
  // TODO: consider lazy writer instead?
  /**
   * Constructs a new WriterT reference.
   *
   * @template {Monad} KMonad
   * @template {Monoid} TStream
   * @template TResult
   * @param {KMonad<[TResult, TStream]>} writer
   * The internal writer monad.
   */
  function WriterT(writer) {
    if (new.target === undefined) {
      return new WriterT(writer);
    }
    else {
      this.value = writer;
    }
  }

  WriterT |> impl(Functor, {
    [Functor.map](fn) {
      return WriterT(runWriterT(this) |> map(fn));
    }
  });

  WriterT |> impl(Applicative, {
    [Applicative.pure](initialResult, MonoidConstructor) {
      return WriterT([initialResult, MonoidConstructor |> empty]
        |> pure(MonadConstructor)
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
   * @template {Monad} KMonad
   * @template {Monoid} TStream
   * @template TResult
   * @param {WriterT<TStream, KMonad, TResult>} writerT
   * The writer from which to extract computation output.
   *
   * @return {KMonad<TStream>}
   * Returns the extracted writer computation.
   */
  const execWriterT = writerT =>
    runWriterT(writerT) |> map(([_, output]) => output);

  /**
   * Maps a writer monad into a new kind of writer monad.
   *
   * @template {Monad} KInputMonad
   * @template {Monad} KOutputMonad
   * @template TInputResult, TInputStream
   * @template TOutputResult, TOutputStream
   * @param {KOutputMonad} NewMonadConstructor
   * The monad constructor to map into.
   *
   * @param {function(KInputMonad<[TInputResult, TInputStream]>)
   *   : KOutputMonad<[TOutputResult, TOutputStream]>} fn
   * The function which maps over 2 monads kind.
   *
   * @return {function(WriterT<TInputStream, KInputMonad, TInputResult>)
   *   : WriterT<TOutputStream, KOutputMonad, TOutputResult>}
   * Returns the new created writer monad.
   */
  const mapWriterT = (NewMonadConstructor, fn) => writerT => {
    const {WriterT} = getWriterT(NewMonadConstructor);
    return WriterT(runWriterT(writerT) |> pipe(fn));
  };

  /** @typedef WriterTImpl **/
  return {WriterT, execWriterT, mapWriterT};
};

/**
 * @template {Monad} KMonad
 * @type {WeakMap<Constructor<KMonad>, ImplWriterT<KMonad>}
 */
const writers = new WeakMap();
