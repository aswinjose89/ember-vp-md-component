import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        openPopup() {
            this.mdDialogManager.popup({
                componentName: 'basic-popup',
                text: 'From the config, basic-popup',
                size: 'medium'
            });
        },
        openPopupOverPopup() {
            this.mdDialogManager.popup({
                componentName: 'popup-example',
                text: 'From the config, popup-example'
            });
        },
        helloFromPopup() {
            Ember.Logger.log('helloFromPopup action:', ...arguments);
        }
    }
});