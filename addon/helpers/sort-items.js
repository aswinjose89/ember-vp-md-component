import Ember from 'ember';

export function sortItems(params, hash) {
    let items = params[0];
    if (Ember.isEmpty(items) || Ember.get(items, 'length') === 0) {
        return items;
    }
    return Ember.A(items).sortBy(hash.sortBy);
}

export default Ember.Helper.helper(sortItems);