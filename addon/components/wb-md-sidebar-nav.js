import Ember from 'ember';
import layout from '../templates/components/wb-md-sidebar-nav';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    tagName: '',
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    actions: {
        triggerSendAction() {
            this.sendAction('action');
        },
        showToolTip(data) {
            if (Ember.isEmpty(data)) {
                return;
            }
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: true
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        }
    }
});