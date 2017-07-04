import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super(...arguments);
        controller.set('startDate', '662659200000');
        controller.set('monthConfig', {});
        controller.set('dateValue', '1473656447');
    },
    actions: {
        changeStartDate() {
            Ember.Logger.log('Start date change from ', new Date(parseInt(this.controller.get('startDate'))), ' to ', new Date(1448865221000));
            this.controller.set('startDate', '1448865221000');
        },
        changeInputDate() {
            this.controller.set('dateValue', Date.now());
        },
        clearInputDate() {
            this.controller.set('dateValue', null);
        },
        dateChanged() {
            Ember.Logger.log('dateChanged', ...arguments);
        }
    }
});