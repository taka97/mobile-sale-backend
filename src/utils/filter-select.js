import _ from 'lodash';

function filterSelect(select, allowField, excludeField) {
  if (!allowField && !excludeField) return select;
  const field = _.pull(allowField, ...excludeField);
  const result = _.intersection(Array.isArray(select) ? select : [select], field);

  return result.length === 0 ? field : result;
}

export default filterSelect;
