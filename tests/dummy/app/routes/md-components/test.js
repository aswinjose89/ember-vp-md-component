import Ember from 'ember';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';

export default Ember.Route.extend(MaterialLayoutHandler, {
    isMDLayoutFullWidth: false,
    isMDFluidLayout: true,
    showMDToggleSideBar: true,
    setupController(controller) {
        controller.set("routableHeaderContent", Ember.A([
            Ember.Object.create({
                label: "ALL",
                "id": 1,
            }),
            Ember.Object.create({
                label: "FAVOURITES",
                "id": 2
            }),
            Ember.Object.create({
                label: "C-SUITES",
                "id": 3
            })
        ]));
        controller.set("routableTabConfig", {
            "routable": true,
            "isButton": true,
            "route": "tabs.tab",
            "tabs": controller.get("routableHeaderContent")
        });
        controller.set('iconToolbarConfig', {
            visibleItems: '3',
            items: Ember.A([
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: Ember.Object.create({
                        iconName: "search",
                        label: "Search",
                        action: "searchAction"
                    })
                }),
                Ember.Object.create({
                    componentName: 'wb-md-action-menu',
                    config: Ember.Object.create({
                        triggerElement: Ember.Object.create({
                            componentName: 'wb-md-icon',
                            config: Ember.Object.create({
                                iconName: 'get_app'
                            })
                        }),
                        items: Ember.A([
                            Ember.Object.create({
                                iconName: 'get_app',
                                label: 'Export All',
                                action: 'exportAll'
                            }),
                            Ember.Object.create({
                                iconName: 'receipt',
                                label: "By Report",
                                action: 'exportByReport',
                                items: Ember.A([
                                    Ember.Object.create({
                                        label: "Enquiry",
                                        isSelected: false,
                                        action: 'test'
                                    }), Ember.Object.create({
                                        label: "Audit Trail",
                                        isSelected: false,
                                        action: 'test'
                                    })
                                ])
                            })
                        ])
                    })
                })
            ])
        });
        controller.set('actionMenuConfig', {
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'remove_circle',
                    label: 'Edit',
                    action: 'test'
                }), Ember.Object.create({
                    label: "Edit",
                    action: "test",
                    items: Ember.A([
                        Ember.Object.create({
                            label: "Sub menu 1",
                            action: "test",
                            isSelected: false
                        }), Ember.Object.create({
                            label: "Sub menu 1",
                            action: "test",
                            isSelected: true
                        }), Ember.Object.create({
                            label: "Sub menu 1",
                            action: "test",
                            isSelected: true
                        })
                    ])
                }), Ember.Object.create({
                    groupHeader: 'Group 1',
                    divider: true,
                    items: Ember.A([
                        Ember.Object.create({
                            iconName: "comment",
                            label: "Delete Comment",
                            action: "test",
                            isSelected: true
                        }),
                        Ember.Object.create({
                            iconName: "comment",
                            label: "View",
                            action: "test"
                        })
                    ])
                }), Ember.Object.create({
                    iconName: "remove_circle",
                    label: "New",
                    action: "newRecord",
                    divider: true
                })
            ])
        });
    },
    actions: {
        test() {

        }
    }
});