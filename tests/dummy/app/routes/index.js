import Ember from 'ember';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';

export default Ember.Route.extend(MaterialLayoutHandler, {
    init() {
        this._super(...arguments);
    },
    isMDLayoutFullWidth: false,
    isMDFluidLayout: false,
    showMDToggleSideBar: false,
    actions: {
        triggerFullLayout() {
            this.set('isMDFluidLayout', false);
            this.set('showMDToggleSideBar', false);
            this.toggleProperty('isMDLayoutFullWidth');
            this.updateApplicationProperty('isMDFluidLayout', this.get('isMDFluidLayout'));
            this.updateApplicationProperty('isMDLayoutFullWidth', this.get('isMDLayoutFullWidth'));
        },
        triggerMDFluidLayout() {
            this.set('isMDLayoutFullWidth', false);
            this.toggleProperty('isMDFluidLayout');
            if (!this.get('isMDFluidLayout')) {
                this.set('showMDToggleSideBar', false);
                this.updateApplicationProperty('showMDToggleSideBar', this.get('showMDToggleSideBar'));
            }
            this.updateApplicationProperty('isMDFluidLayout', this.get('isMDFluidLayout'));
            this.updateApplicationProperty('isMDLayoutFullWidth', this.get('isMDLayoutFullWidth'));
        }
    }
});