import Ember from 'ember';

export function formatDate(params) {
    let date = params[0],
        dateFormat = (Ember.isPresent(params[1])) ? params[1] : "DD MMM YYYY";
    if (Ember.isEmpty(date)) {
        return;
    }
    if (Ember.typeOf(params[0]) !== 'date') {
        date = parseInt(date);
    }
    return window.moment(date).format(dateFormat);
}

export default Ember.Helper.helper(formatDate);