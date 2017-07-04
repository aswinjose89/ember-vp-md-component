import Ember from 'ember';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';

export default Ember.Route.extend(MaterialLayoutHandler, {
    isMDLayoutFullWidth: false,
    isMDFluidLayout: true,
    showMDToggleSideBar: true,
    init() {
        this._super(...arguments);
    },
    setupController(controller) {
        controller.set('showChild', false);
        controller.set('showChild2', true);
        controller.set('showTasks', true);
        controller.set('taskStatus', true);
        controller.set('actionMenuConfig', {
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'edit',
                    label: 'Edit',
                    action: 'iconToolbarAction'
                }),
                Ember.Object.create({
                    iconName: 'delete',
                    label: 'Delete',
                    action: 'iconToolbarAction'
                })
            ])
        });
        controller.set('taskExample', [
            Ember.Object.create({
                label: 'Due Date & Responsible Person',
                list: ['12 Apr 2015', '4850285 - Thomas Brown'],
                inlineList: true
            }),
            Ember.Object.create({
                label: 'Created by',
                list: ['3 Mar 2015', '3749572 - Eliise Orav'],
                inlineList: true
            }),
            Ember.Object.create({
                label: 'Status',
                component: {
                    name: 'wb-md-tag',
                    config: {
                        label: '3 DAYS OVERDUE',
                        color: 'red'
                    }
                }
            })
        ]);
        controller.set('taskCreateDate', {
            label: 'Completed On & Responsible Person',
            list: ['12 Apr 2015', '1275039 - Zoe Thomas'],
            inlineList: true
        });
        controller.set('iconToolbarConfig', {
            visibleItems: '0',
            toggleElement: {
                iconDefault: 'unfold_more',
                iconAlternative: 'unfold_less'
            },
            items: Ember.A([
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'edit',
                        label: 'Edit',
                        action: 'iconToolbarAction'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-button',
                    config: {
                        type: 'primary',
                        color: 'blue',
                        label: 'Event',
                        action: 'iconToolbarAction'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'comment',
                        label: 'View',
                        action: 'iconToolbarAction'
                    }
                })
            ])
        });
        controller.set('iconToolbarTaskConfig', {
            visibleItems: '0',
            toggleElement: {
                iconDefault: 'expand_more',
                iconAlternative: 'expand_less'
            },
            items: Ember.A([
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'edit',
                        label: 'Edit',
                        action: 'iconToolbarAction'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'delete',
                        label: 'Delete',
                        action: 'iconToolbarAction'
                    }
                })
            ])
        });
        controller.set('manageCountries', this.getManageCountries());
    },
    actions: {
        openPopup() {
            this.mdDialogManager.popup({
                componentName: 'tb-sales-countries-popup',
                size: 'full'
            });
        },
        openManageCountriesPopup() {
            this.mdDialogManager.popup({
                componentName: 'tb-sales-manage-countries-popup',
                size: 'full',
                componentConfig: {
                    model: this.getManageCountries()
                }
            });
        }
    },
    getManageCountries() {
        return Ember.Object.create({
            scbPresenceCountries: Ember.A([
                Ember.Object.create({
                    "val": "IN",
                    "name": "INDIA"
                }),
                Ember.Object.create({
                    "val": "ID",
                    "name": "INDONESIA"
                })
            ]),
            pendingCountries: Ember.A([
                Ember.Object.create({
                    "val": "IR",
                    "name": "IRAN"
                }),
                Ember.Object.create({
                    "val": "IQ",
                    "name": "IRAQ"
                }),
                Ember.Object.create({
                    "val": "IE",
                    "name": "IRELAND"
                }),
                Ember.Object.create({
                    "val": "IM",
                    "name": "ISLE OF MAN"
                }),
                Ember.Object.create({
                    "val": "IL",
                    "name": "ISRAEL"
                }),
                Ember.Object.create({
                    "val": "IT",
                    "name": "ITALY"
                })
            ]),
            scbNonPresenceCountries: Ember.A([
                Ember.Object.create({
                    "val": "JM",
                    "name": "JAMAICA"
                }),
                Ember.Object.create({
                    "val": "JP",
                    "name": "JAPAN"
                })
            ])
        })
    }
});