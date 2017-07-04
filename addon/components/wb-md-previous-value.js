import Ember from 'ember';
import layout from '../templates/components/wb-md-previous-value';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['previous-value'],
    value: null,
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    actions: {
        showToolTip(data) {
            if (this.get('value')) {
                this.mdTooltipManager.open({
                    label: data,
                    shownOnOverflow: true
                });
            }
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        }
    }
});