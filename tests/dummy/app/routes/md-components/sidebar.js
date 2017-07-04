import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super.apply(this, arguments);
        controller.set('sideBarNavConfig', {
            title: 'Sidebar Title',
            action: 'editAction',
            actionLabel: 'EDIT'
        });
        controller.setProperties({
            defaultSidebar: this.getDefaultSideBar(),
            sideBarWithIcons: this.getSideBarWithIcons()
        });
    },
    actions: {
        editAction() {
            Ember.Logger.log('Edit Action Called');
        }
    },
    getDefaultSideBar() {
        return {
            title: 'Sidebar Title',
            additionalInfo: [{
                    label: 'User Status',
                    componentName: 'wb-md-tag',
                    componentConfig: {
                        label: 'Stable',
                        color: 'green'
                    }
                },
                {
                    label: 'User Id',
                    infoLabel: '001'
                }
            ]
        };
    },
    getSideBarWithIcons() {
        return {
            title: 'Sidebar With Icons',
        };
    }
});