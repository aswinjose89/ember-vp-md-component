
import Ember from 'ember';
import truthConvert from '../utils/truth-convert';

export function or(params/*, hash*/) {
 for (var i=0, len=params.length; i<len; i++) {
    if (truthConvert(params[i]) === true) {
      return params[i];
    }
  }
  return params[params.length-1];
}

export default Ember.Helper.helper(or);
