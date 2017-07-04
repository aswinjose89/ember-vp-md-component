import Ember from 'ember';
import layout from '../templates/components/nested-card-table-row';
import ComponentHelper from 'wb-ui-md-components/mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    tagName: '',
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    actions: {
        auditTrial() {
            Ember.Logger.log('Aduit trial');
            this.get('action')('auditTrialAction', 'Some Arguments');
        },
        markForApproval() {
            Ember.Logger.log('Mark For Approval');
            this.get('action')('markForApproval', 'Some Arguments');
        }
    }
});