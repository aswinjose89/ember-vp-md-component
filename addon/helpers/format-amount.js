import Ember from 'ember';

export function formatAmount(params, hash) {
  const decimalPoints = params[1] ? parseInt(params[1]) : 2;
  let formattedValue = "0", divider = 1000;
  if(isNaN(params[0])){
    return params[0];
  } else {
    // amountScale 1000- in thousands, 1000000- in millions
    if (hash.scale && !isNaN(hash.scale)) {
        divider = hash.scale;
    }
    formattedValue = params[0]/divider;
  }
  formattedValue = accounting.formatNumber(formattedValue, decimalPoints);
  if(params[2] === undefined) {
    formattedValue = formattedValue.replace(/\.00$/,'');
    formattedValue = formattedValue.replace(/\.000$/,'');
  }
  return formattedValue;
}

export default Ember.Helper.helper(formatAmount);
