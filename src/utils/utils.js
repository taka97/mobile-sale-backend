/**
 * Async Foreach
 * @param {object[]} array array of element
 * @param {function} callback callback(current, index, array)
 */
export async function forEachAsync(array, callback) {
  for (let idx = 0; idx < array.length; idx += 1) {
    /* eslint-disable no-await-in-loop */
    await callback(array[idx], idx, array);
  }
}

export function renameProperty(object, prefix) {
  const context = {};

  Object.keys(object).forEach((key) => {
    context[`${prefix}${key}`] = object[key];
  });

  return context;
}
