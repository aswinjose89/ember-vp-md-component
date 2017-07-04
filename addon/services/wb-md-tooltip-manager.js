import Ember from 'ember';

const { getOwner } = Ember;

export default Ember.Service.extend({
    init() {
        this._super(...arguments);
    },
    getApplicationController() {
        return getOwner(this).lookup('controller:application');
    },
    open(componentConfig) {
        Ember.run.next(() => {
            let controller = this.getApplicationController();
            controller.setProperties({
                displayMdtooltip: true,
                mdToolTipComponent: 'wb-md-tooltip',
                mdToolTipConfig: {
                    componentConfig: componentConfig
                }
            });
        });
    },
    close() {
        let controller = this.getApplicationController();
        controller.setProperties({
            displayMdTooltip: false,
            mdToolTipComponent: null,
            mdToolTipConfig: {
                label: null,
                vCard: null,
                shownOnOverflow: false
            }
        });
    }
});