import Ember from 'ember';

export function dropItemId(params, hash) {
    let newId = Ember.guidFor(params[0]);
    return newId;
}

export default Ember.Helper.helper(dropItemId);