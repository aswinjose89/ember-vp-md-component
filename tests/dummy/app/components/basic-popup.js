import Ember from 'ember';
import layout from '../templates/components/basic-popup';

export default Ember.Component.extend({
    layout,
    tagName: '',
    componentConfig: Ember.computed.reads('config.componentConfig'),
    init(){
        this._super(...arguments);
        this.set('helloFromPopup','helloFromPopup');
    },
    didRender(){
        Ember.run.later(this, function(){
            this.sendAction('helloFromPopup', 'Hello from team information');
        }, 100);
    },
    actions: {
        closeDialog(){
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        },
        showAlert(){
            this.mdDialogManager.alert({
                message: 'Some Alert message',
                title: 'Alert title',
                showTopBar: true,
                showActionBar: true,
                buttonLabel: 'OK'
            });
        }
    }
});
