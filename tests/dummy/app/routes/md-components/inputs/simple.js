import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('user');
    },
    actions: {
        enterAction() {
            Ember.Logger.log('Enter action called', ...arguments);
            this.mdSnackBarManager.open({
                position: 'bottom-left',
                autoCloseTimer: 10000,
                isAutoClose: false,
                text: "Enter action called"
            });
        },
        triggerSearchAction(searchKey) {
            Ember.Logger.log('Search triggered', searchKey);
        },
        inputFocusIn() {
            Ember.Logger.log('inputFocusIn', ...arguments);
        },
        inputFocusOut() {
            Ember.Logger.log('inputFocusOut', ...arguments);
        },
        showGuidance(helpText) {
            Ember.Logger.log('showGuidance', ...arguments);
            this.mdDialogManager.alert({
                message: helpText,
                title: 'Liabilities Help',
                showTopBar: true,
                showActionBar: true,
                buttonLabel: 'OK'
            });
        }
    }
});