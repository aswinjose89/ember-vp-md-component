import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let filters = JSON.stringify({
            pagination: {
                page: 1,
                size: 10
            }
        });
        return this.get('store').query('user', {
            filters
        });
    }
});