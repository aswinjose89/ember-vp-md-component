import Ember from 'ember';

export function priorityConditionalClass(params, hash) {
    let condition = params[0];
    if ((Ember.isEmpty(hash.priorityCondition) && condition) || (hash.priorityCondition || (hash.priorityCondition && condition))) {
        return hash.className;
    }
    return;
}

export default Ember.Helper.helper(priorityConditionalClass);