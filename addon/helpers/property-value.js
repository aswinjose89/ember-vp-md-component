import Ember from 'ember';

export function propertyValue(params/*, hash*/) {
  let object = params[0];
  let property = params[1];
  if (object === undefined || object === '') {
    return '';
  }
  return object[property] ? object[property] : '';
}

export default Ember.Helper.helper(propertyValue);
