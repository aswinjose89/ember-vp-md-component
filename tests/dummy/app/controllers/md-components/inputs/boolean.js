import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        switchChange() {
            console.log('Swith changed', arguments[0]);
        }
    }
});