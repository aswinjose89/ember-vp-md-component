import Ember from 'ember';
import layout from '../templates/components/wb-md-switch';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    value: false,
    classNames: ['input-switch'],
    classNameBindings: [
        'isDisabled:input-switch_status_disabled',
        'inputBox:input-switch_padding_input'
    ],
    isDisabled: Ember.computed('disabled', function () {
        return this.get('disabled');
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    actions: {
        toggleSwitch(event) {
            if (!this.get('disabled') && !this.get('manual')) {
                this.toggleProperty('value');
                Ember.tryInvoke(this, 'onChange', [this.get('value'), event]);
            }
        }
    }
});