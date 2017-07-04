import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        save() {
            Ember.Logger.log('save action', ...arguments);
        }
    }
});