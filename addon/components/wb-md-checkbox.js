import Ember from 'ember';
import layout from '../templates/components/wb-md-checkbox';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['input-checkbox'],
    classNameBindings: [
        'isDisabled:input-checkbox_status_disabled',
        'isError:input-checkbox_status_error'
    ],
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    isDisabled: Ember.computed('disabled', function () {
        return this.get('disabled');
    }),
    didRender() {
        this.addRippleEffect(this.get('element').querySelector('.input-checkbox__icon'));
    },
    click(event) {
        if (!this.get('disabled')) {
            this.toggleProperty('checked');
            Ember.tryInvoke(this, 'onChange', [this.get('checked'), event]);
        }

    }
});