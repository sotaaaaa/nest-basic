import assert from 'assert';
import * as _ from 'lodash';

export class PromiseUtils {
  /**
   * Resolves the first fulfilled promise from an iterable of values.
   * If no promise is fulfilled, an error is thrown.
   *
   * @template T - The type of the values in the iterable.
   * @param {Iterable<T | PromiseLike<T>>} values - The iterable of values or promises.
   * @returns {Promise<T>} - A promise that resolves to the value of the first fulfilled promise.
   * @throws {Error} - If no promise is fulfilled.
   */
  static async oneResolveForMulti<T = any>(values: Iterable<T | PromiseLike<T>>) {
    const resolves = await Promise.allSettled(values);
    const promise = _.find(resolves, [
      'status',
      'fulfilled',
    ]) as PromiseFulfilledResult<T>;
    assert.ok(promise, new Error('[OneResolveForMulti] Promise not fulfilled'));

    return promise.value;
  }
}
