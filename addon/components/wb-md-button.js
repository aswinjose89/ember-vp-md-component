import Ember from 'ember';
import layout from '../templates/components/wb-md-button';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    tagName: 'div',
    ripple: true,
    promise: null,
    classNames: ["button-ripple", "button"],
    classNameBindings: [
        'buttonSize',
        'buttonType',
        'buttonColor',
        'buttonState',
        'active:button_status_active'
    ],
    didRender() {
        if (this.get('ripple')) {
            this.addRippleEffect(this.get('element'));
        }
    },
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    /**
     * The Property buttonSize is used to accept size of button from user.
     * Acceptable sizes are : small
     *
     * @property {string} size
     * @default  ''
     */
    buttonSize: Ember.computed('size', function () {
        return (this.get('size') === 'small') ? 'button_size_28' : '';
    }),

    buttonColor: Ember.computed('color', 'isRaised', 'disabled', function () {
        if (this.get('disabled')) {
            return;
        }
        return this.get('isRaised') ? `button_color_raised-${this.get('color')}` : `button_color_${this.get('color')}`;
    }),
    isRaised: Ember.computed('type', function () {
        return this.get('type') === 'primary';
    }),
    buttonType: Ember.computed('type', function () {
        let buttonType = this.get('type');
        if (buttonType === 'primary') {
            return 'button_type_raised';
        } else if (buttonType === 'secondary') {
            return ' button_color_dark';
        } else if (buttonType === 'link') {
            return 'button_color_link';
        }
    }),
    buttonState: Ember.computed('disabled', function () {
        if (!this.get('disabled')) {
            return;
        }
        let isRaised = this.get('isRaised');
        if (isRaised) {
            return this.isLightColor(this.get('color')) ? 'button_status_disabled-raised-light' : 'button_status_disabled-raised-dark';
        } else {
            return this.isLightColor(this.get('color')) ? 'button_status_disabled-light' : 'button_status_disabled-dark';
        }
    }),
    iconColor: Ember.computed('color', 'disabled', function () {
        if (Ember.isEmpty(this.get('color'))) {
            return 'black';
        }
        return (this.isLightColor(this.get('color')) || this.get('disabled')) ? 'black' : 'white';
    }),
    didPromiseStateChanged: Ember.observer('promise', function () {
        let promise = Ember.get(this, 'promise');
        if (Ember.isEmpty(promise)) {
            return;
        }
        this.set('disabled', true);
        promise
            .then()
            .catch((error) => {
                if (!this.isDestroyed) {
                    Ember.Logger.error(`${this.get('label')}, async action:`, error);
                }
            })
            .finally(() => this.set('disabled', false));
    }),
    /**
     * Capture the click event and fires the action for user by the name specified by him in action attribute.
     *
     * @function click
     * @returns  {void}action
     */
    click(e) {
        if (this.get('async') === true) {
            this.handleAsync(this, arguments);
        } else if (this.get('onClickAction')) {
            this.get('onClickAction')();
        } else {
            let params = Ember.A(this.get('params'));
            this.sendAction('action', this.get('params'), ...params, e);
        }
    },
    handleAsync() {
        let params = Ember.getWithDefault(this, 'params', []);
        let callbackHandler = (promise) => {
            Ember.set(this, 'promise', promise);
        };
        if (typeof this.attrs.action === 'function') {
            let promise = this.attrs.action(...params);
            if (promise && typeof promise.then === 'function') {
                callbackHandler(promise);
            }
        } else {
            let actionArguments = ['action', callbackHandler, ...params];
            this.sendAction(...actionArguments);
        }
        return false;
    }
});