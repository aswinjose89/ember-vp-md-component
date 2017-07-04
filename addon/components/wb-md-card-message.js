import Ember from 'ember';
import layout from '../templates/components/wb-md-card-message';

export default Ember.Component.extend({
    layout,
    type: 'general', /*warning, error, info*/
    tagName: 'div',
    classNames: ['card-message'],
    iconWrapperColor: null,
    iconColor: "white",
    linkAction: "card-message-closed",
    classNameBindings: [
        'messageType',
        'shortMessage:card-message_short',
        'shadow:card-message_shadow'
    ],
    init(){
        this._super(...arguments);
    },
    messageType: Ember.computed('type', function () {
        if (!Ember.isEmpty(this.get('type'))) {
            return "card-message_type_" + this.get('type');
        }
    }),
    shortMessage: Ember.computed('title', function () {
        if (Ember.isEmpty(this.get('title'))) {
            return true;
        }
    }),
    iconWrapperColorClass: Ember.computed('iconWrapperColor', function () {
        if (!Ember.isEmpty(this.get('iconWrapperColor'))) {
            return "card-message__icon_color_" + this.get('iconWrapperColor');
        }
        else {
            if (!Ember.isEmpty(this.get('type')) && this.get('type').toString() === "error") {
                return "card-message__icon_color_red";
            }
        }
    }),
    actions: {
        closeMessage(){
            this.sendAction(this.get('linkAction'), this.get('linkActionValue'));
            if(this.get('onCloseClick')){
                this.get('onCloseClick')();
            }
            this.destroy();
        }
    }
});
