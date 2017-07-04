import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        enterClosureAction(label) {
            Ember.Logger.log('Enter closure action called', ...arguments);
            this.mdSnackBarManager.open({
                position: 'bottom-left',
                autoCloseTimer: 10000,
                isAutoClose: false,
                text: 'Enter closure action called' + label
            });
        }
    }
});