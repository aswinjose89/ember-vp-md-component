import Ember from 'ember';

export function isSelectedItem(params /*, hash*/ ) {
    let record = params[0],
        selectedItems = params[1],
        optionValuePath = params[2],
        value = Ember.get(record, optionValuePath);
    if (selectedItems.isAny(optionValuePath, value)) {
        return true;
    }
    return;
}

export default Ember.Helper.helper(isSelectedItem);