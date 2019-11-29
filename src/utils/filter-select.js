import debug from 'debug';
import _ from 'lodash';

const dg = debug('MS::utils::filterSelect');

function filterSelect(select, allowField, excludeField) {
  if (!allowField && !excludeField) return select;
  let field = _.pull(allowField, ...excludeField);
  let result = _.intersection(Array.isArray(select) ? select : [select], field);

  return result.length === 0 ? field : result;
}

export default filterSelect;

