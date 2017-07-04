import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel() {
        this.transitionTo('md-components.tables.static');
    }
});