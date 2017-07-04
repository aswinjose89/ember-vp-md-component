import Ember from 'ember';
import layout from '../templates/components/wb-md-icon';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['global-icon'],
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    ripple: true,
    classNameBindings: [
        'isActive',
        'isSmall:global-icon_size_8',
        'isMedium:global-icon_size_16',
        'isLarge:global-icon_size_18',
        'isDisabled:global-icon_status_disabled',
        'disabled:global-icon_status_disabled',
        'isReadOnly:global-icon_status_readonly',
        'iconColor'
    ],
    iconColor: Ember.computed('color', 'toggleValue', function () {
        let iconColor = this.get('color');
        if (this.get('isToggle')) {
            iconColor = this.get('toggleValue') ? this.get('color') : 'gray-light';
        }
        if (!Ember.isEmpty(this.get('color'))) {
            return 'global-icon_color_' + iconColor;
        }
    }),
    didRender() {
        if (this.get('ripple')) {
            this.addRippleEffect(this.get('element'));
        }
    },
    isSmall: Ember.computed('size', function () {
        return this.get('size') === 'small';
    }),
    isMedium: Ember.computed('size', function () {
        return this.get('size') === 'medium';
    }),
    isLarge: Ember.computed('size', function () {
        return this.get('size') === 'large';
    }),
    isActive: Ember.computed('active', 'color', function () {
        if (!Ember.isEmpty(this.get('active')) && this.get('active') === true) {
            if (this.get('color') === 'white') {
                return `global-icon_status_active-white`;
            } else {
                return `global-icon_status_active-gray`;
            }
        }
    }),
    click(e) {
        this.send('toggleAction');
        if (this.get('onClickAction')) {
            this.get('onClickAction')();
        } else {
            let params = Ember.A(this.get('params'));
            this.sendAction('action', this.get('params'), ...params, e);
        }
    },
    mouseEnter() {
        if (this.get('helpText')) {
            this.mdTooltipManager.open({
                label: this.get('helpText')
            });
        }
    },
    mouseLeave() {
        if (this.get('helpText')) {
            this.mdTooltipManager.close();
        }
    },
    actions: {
        toggleAction() {
            if (this.get('isToggle')) {
                this.toggleProperty('toggleValue');
                if (Ember.isEmpty(this.get('onToggle'))) {
                    return;
                }
                this.get('onToggle')();
            }
        }
    }
});