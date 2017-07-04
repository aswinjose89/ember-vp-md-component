import Ember from 'ember';

export function avatarInitial(params) {
    if(Ember.isEmpty(params)){
        return '';
    }
    let name = Ember.A(params[0].match(/\S+/g)).reduce(function(initial, name){
        return initial + name[0];
    }, '');
    return name.toUpperCase();
}

export default Ember.Helper.helper(avatarInitial);
