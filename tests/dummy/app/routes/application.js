import Ember from 'ember';
import MaterailHandler from 'wb-ui-md-components/mixins/material-layout-handler';

export default Ember.Route.extend(MaterailHandler, {
    setupController(controller) {
        this._super.apply(this, arguments);
        controller.set('sideBarNavConfig', {
            additionalInfo: [{
                label: 'Version',
                componentName: 'wb-md-tag',
                componentConfig: {
                    label: '1.0.0-beta.31',
                    color: 'green'
                }
            }]
        });
        controller.set('contentToolbarActionMenuConfig', {
            triggerElement: Ember.Object.create({
                componentName: 'wb-md-button',
                config: Ember.Object.create({
                    type: 'link',
                    label: 'UPDATE'
                })
            }),
            items: Ember.A([
                Ember.Object.create({
                    label: 'Replace RAM',
                    action: 'replaceRam'
                }),
                Ember.Object.create({
                    label: 'Coverage Location',
                    action: 'coverageLocation'
                }),
                Ember.Object.create({
                    label: 'Inherit RAM',
                    action: 'inheritRAM'
                })
            ])
        });
    },
    actions: {
        didTransition() {
            /* jshint undef: false */
            Ember.run.scheduleOnce('afterRender', this, () => Prism.highlightAll());
            this.nullScrollPosition();
            return true; // Bubble the didTransition event
        },
        floatsidebar() {
            this.controller.toggleProperty('showMDToggleSideBar');
        }
    }
});