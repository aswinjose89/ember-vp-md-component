import Ember from 'ember';
import layout from '../templates/components/wb-md-tag';
import ComponentHelper from '../mixins/component-helper';

const {
    Component,
    isEmpty
} = Ember;

export default Component.extend(ComponentHelper, {
    layout,
    classNames: ['global-tag', 'global-tag_old'],
    classNameBindings: [
        'tagBackgroundColor'
    ],
    hasTooltip: Ember.computed('tooltip', function () {
        return Ember.isPresent(this.get('tooltip'));
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    tagBackgroundColor: Ember.computed('color', function () {
        if (!isEmpty(this.get('color'))) {
            return 'global-tag_color_' + this.get('color');
        }
    }),
    circleStatusColor: Ember.computed('circle', function () {
        if (!isEmpty(this.get('circle'))) {
            return 'global-tag__value_circle_' + this.get('circle');
        }
    }),
    mouseEnter() {
        if (this.get('hasTooltip')) {
            let toolip = this.get('tooltip');
            this.mdTooltipManager.open({
                ...toolip,
                shownOnOverflow: false
            });
        } else if (Ember.isPresent(this.get('helpText'))) {
            this.mdTooltipManager.open({
                label: this.get('helpText'),
                shownOnOverflow: false
            });
        }
    },
    mouseLeave() {
        if (this.get('hasTooltip') || Ember.isPresent(this.get('helpText'))) {
            this.mdTooltipManager.close();
        }
    }
});