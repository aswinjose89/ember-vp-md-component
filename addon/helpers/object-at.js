import Ember from 'ember';

export function objectAt(params, hash) {
    let array = Ember.get(hash, 'array'),
    index = Ember.get(hash, 'index'),
    id = Ember.get(hash, 'id');
    if(Ember.isPresent(id) && Ember.isPresent(array)){
        return Ember.A(array).findBy('id', id);
    }
    if(Ember.isPresent(array) && Ember.isPresent(index)){
        return hash.array[hash.index];
    }
}

export default Ember.Helper.helper(objectAt);
