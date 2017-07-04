import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super.apply(this, arguments);
        controller.set('actionMenuChildConfig', {
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'remove_circle',
                    label: 'Edit',
                    action: 'test',
                    isDisabled: true
                }), Ember.Object.create({
                    label: "Edit",
                    action: "test",
                    isDisabled: false,
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
                    iconName: 'remove_circle',
                    label: 'Edit',
                    action: 'test'
                })
            ])
        });
        controller.set('actionMenuGroupHeaderConfig', {
            triggerElement: Ember.Object.create({
                componentName: 'wb-md-button',
                config: Ember.Object.create({
                    label: 'action',

                    type: 'link'
                })
            }),
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'remove_circle',
                    label: 'Edit',
                    action: 'test'
                }),
                Ember.Object.create({
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
                })
            ])
        });
        controller.set('actionMenuConfig', {
            items: Ember.A([
                Ember.Object.create({
                    iconName: 'remove_circle',
                    label: 'Edit',
                    action: 'test',
                    divider: true
                }), Ember.Object.create({
                    iconName: "remove_circle",
                    label: "New",
                    action: "newRecord",
                    divider: true
                })
            ])
        });
        controller.set('isFavourite', false);
        controller.set('iconName', "star");
        controller.set('iconToolbarExample', Ember.Object.create({
            visibleItems: '3',
            color: 'white',
            items: Ember.A([
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'event',
                        label: 'Audit'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'restore',
                        label: 'Local Library'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: Ember.Object.create({
                        iconName: this.controller.get('iconName'),
                        label: 'Mark Unread',
                        action: 'setAsFavourite',
                        color: 'red-500'
                    })
                })
            ])
        }));
        controller.set('iconToolbarConfig', {
            visibleItems: '4',
            color: 'black',
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
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'file_download',
                        label: 'Download',
                        action: 'iconToolbarAction',
                    },
                    groupHeader: 'Group Header'
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'delete',
                        label: 'Delete',
                        action: 'iconToolbarAction'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'check',
                        label: 'Submit for review',
                        action: 'iconToolbarAction'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-action-menu',
                    config: Ember.Object.create({
                        items: Ember.A([
                            Ember.Object.create({
                                iconName: 'remove_circle',
                                label: 'Edit',
                                action: 'test'
                            }), Ember.Object.create({
                                label: "Edit",
                                items: Ember.A([
                                    Ember.Object.create({
                                        label: "Sub menu 1",
                                        action: "menuAction",
                                        isSelected: false
                                    }), Ember.Object.create({
                                        label: "Sub menu 1",
                                        action: "menuAction",
                                        isSelected: true
                                    }), Ember.Object.create({
                                        label: "Sub menu 1",
                                        action: "menuAction",
                                        isSelected: true
                                    })
                                ])
                            }), Ember.Object.create({
                                iconName: 'remove_circle',
                                label: 'Edit',
                                action: 'test'
                            })
                        ])
                    })
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'padlock',
                        label: 'Lock',
                        action: 'iconToolbarAction',
                        isDisabled: true
                    }
                })
            ])
        });
    },
    model() {
        return {
            iconToolbarExample: this.iconToolbarExample()
        };
    },
    iconName: 'star',
    iconToolbarExample() {
        return Ember.Object.create({
            visibleItems: '3',
            color: 'white',
            items: Ember.A([
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'event',
                        label: 'Audit'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: {
                        iconName: 'restore',
                        label: 'Local Library'
                    }
                }),
                Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: Ember.Object.create({
                        iconName: this.get('iconName'),
                        label: 'Mark Unread',
                        action: 'setAsFavourite',
                        color: 'red-500'
                    })
                })
            ])
        });
    },
    actions: {
        clickAction(actionName) {
            console.log(actionName);
        },
        deleteRecord() {
            console.log("Controller action: Delete");
        },
        newRecord() {
            console.log("Controller action: New");
        },
        viewRecord() {
            console.log("Controller action: View");
        },
        editRecord() {
            console.log("Controller action: Edit");
        },
        setAsFavourite() {
            this.controller.toggleProperty('isFavourite');
            this.set('iconName', 'edit');
            this.refresh();
        }
    }
});