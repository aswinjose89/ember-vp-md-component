import Ember from 'ember';

export function emberPropertyValue(params/*, hash*/) {
  let object = params[0];
  let property = params[1];
  if (object === undefined || object === '') {
    return '';
  }
  return object.get(property) ? object.get(property) : '';
}

export default Ember.Helper.helper(emberPropertyValue);
