import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        test(item) {
            Ember.Logger.log('test action from submenus', item);
        },
        exportAll(item) {
            Ember.Logger.log('exportAll action: ', item);
        },
        searchAction(item) {
            Ember.Logger.log('Search action: ', item);
        },
        exportByReport(item) {
            Ember.Logger.log('Export by report action: ', item);
        }
    }
});