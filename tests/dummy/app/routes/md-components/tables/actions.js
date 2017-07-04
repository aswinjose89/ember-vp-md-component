import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super(...arguments);
        controller.set('rowActionTableConfig', this.getrowActionTableConfig());
        controller.set('actionMenuTableConfig', this.getActionMenuTableConfig());
    },
    dynamicHeaderConfig: Ember.Object.create({
        action: 'tableSelectionChange',
        iconName: 'arrow_drop_down',
        value: {},
        optionLabelPath: 'name',
        content: Ember.A([
            Ember.Object.create({
                id: 1,
                name: 'Asia',
                content: Ember.A([
                    Ember.Object.create({
                        id: 11,
                        name: 'China'
                    }),
                    Ember.Object.create({
                        id: 12,
                        name: 'Japan'
                    }),
                    Ember.Object.create({
                        id: 13,
                        name: 'India'
                    })
                ])
            }),
            Ember.Object.create({
                id: 2,
                name: 'Africa',
                content: Ember.A([
                    Ember.Object.create({
                        id: 21,
                        name: 'Algeria'
                    }),
                    Ember.Object.create({
                        id: 22,
                        name: 'Egypt'
                    }),
                    Ember.Object.create({
                        id: 23,
                        name: 'Libya'
                    })
                ])
            })
        ])
    }),
    actions: {
        menuAction(actionName, content) {
            Ember.Logger.log(arguments, 'invoked');
            this.send(actionName, content);
        },
        tableSelectionChange(selectedItem) {
            Ember.Logger.log('Action from table select', ...arguments);
            this.set('dynamicHeaderConfig.value', {
                id: 12,
                name: 'New ' + selectedItem.get('name')
            });

        },
        viewAction(content) {
            Ember.Logger.log('View Action Called in Route', content);
        },
        newAction(content) {
            Ember.Logger.log('New Action Called in Route', content);
        },
        deleteAction(content) {
            Ember.Logger.log('deleteAction Called in Route', content);
        },
        editAction(content) {
            Ember.Logger.log('editAction Called in Route', content);
        },
        togglePropertyChanged() {
            Ember.Logger.log('togglePropertyChanged Called in Route', ...arguments);
        },
        linkAction() {
            Ember.Logger.log('Link Action called', ...arguments);
        },
        userClickAction() {
            Ember.Logger.log('User Action clicked in route', ...arguments);
        }
    },
    getrowActionTableConfig() {
        return {
            tableHeading: 'Table with single row action',
            content: this.getStaticData(),
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            columns: [{
                field: 'idType',
                type: 'text',
                title: 'ID Type',
                leftIconName: 'contacts',
                leftIconColor: 'blue',
                leftIconAction: 'userClickAction',
            }, {
                field: 'idNumber',
                type: 'text',
                title: 'ID Number dd'
            }, {
                field: 'isValid',
                type: 'boolean',
                toggleAction: {
                    iconName: "star",
                    action: 'togglePropertyChanged',
                    color: 'orange-400'
                }
            }, {
                field: 'fileComp',
                type: 'component',
                componentName: 'wb-md-file',
                action: 'userClickAction',
                title: 'File'
            }, {
                field: 'country',
                type: 'text',
                rightIconHelpText: 'Add to call list',
                rightIconName: 'phone_in_talk',
                rightIconColor: 'red-500',
                hideIconField: 'isHideIcon',
                rightIconAction: 'userClickAction',
                title: 'Country',
                popupHeader: 'Country Full Name',
                isPriorityWidth: true
            }, {
                field: 'countries',
                type: 'array',
                arrayLabelPath: 'name',
                listTitle: 'Names',
                title: 'Countries',
                isPriorityWidth: true
            }]
        };
    },
    getActionMenuTableConfig() {
        let dynamicHeaderConfig = this.get('dynamicHeaderConfig');
        return {
            tableHeading: 'User Table',
            content: this.getActionMenuData(),
            disableRowActionField: 'isRowActionDisabled',
            rowActions: {
                items: [{
                        label: "Delete",
                        action: "deleteAction",
                        iconName: "remove_circle",
                        isDisabled: true
                    }, {
                        label: "View",
                        action: "viewAction",
                        iconName: "info",
                        divider: true
                    },
                    Ember.Object.create({
                        groupHeader: 'Group 1',
                        divider: true,
                        items: Ember.A([
                            Ember.Object.create({
                                iconName: "comment",
                                label: "Delete Comment",
                                action: "test"
                            }),
                            Ember.Object.create({
                                iconName: "comment",
                                label: "View",
                                action: "test"
                            })
                        ])
                    }), {
                        label: "New",
                        action: "newAction",
                        iconName: "add_circle",
                        divider: true
                    }
                ],
                position: "right"
            },
            columns: [{
                field: 'idType',
                type: 'link',
                action: 'linkAction',
                leftIconName: 'contacts',
                leftIconColor: 'blue',
                leftIconHelpText: 'Contacts',
                vCardField: 'customVCardField',
                isPriorityWidth: true,
                title: 'ID Type'
            }, {
                field: 'idNumber',
                type: 'entityLink',
                isArray: true,
                arrayLabelPath: 'name',
                disableLink: true,
                listTitle: 'Names',
                enityIconFiled: 'enityName',
                entityColorField: 'enityColor',
                isPriorityWidth: true,
                action: 'linkAction',
                title: 'ID Number'
            }, {
                field: 'isValid',
                type: 'boolean',
                title: 'Valid'
            }, {
                field: 'isValidStatus',
                type: 'component',
                componentName: 'wb-md-tag',
                action: 'deleteAction',
                title: 'Status'
            }, {
                field: 'country',
                type: 'text',
                headerType: 'dropdown',
                headerConfig: dynamicHeaderConfig,
                title: 'Country',
                isPriorityWidth: true
            }, {
                field: 'comments',
                type: 'text',
                title: 'Comments'
            }]
        };
    },
    getStaticData() {
        return Ember.A([
            Ember.Object.create({
                idType: 'Passport',
                id: 11,
                idNumber: 'XYZKJH',
                enityName: 'D',
                enityColor: '',
                isValid: true,
                fileComp: {
                    type: 'pdf',
                    name: 'SampleFileName'
                },
                country: 'India',
                countries: this.getCountries(),
                isDisabled: true,
            }),
            Ember.Object.create({
                idType: 'Voter ID',
                id: 22,
                idNumber: 'JGKJBSW78658',
                highlightBarColor: 'black',
                enityName: 'G',
                enityColor: 'blue-500',
                fileComp: {
                    type: 'doc',
                    name: 'Sample File Name 2'
                },
                isValid: false,
                country: 'United Kingdom of Great Britain and Northern Ireland',
                isHideIcon: true,
                countries: Ember.A([{
                    id: 1,
                    name: 'United Kingdom of Great Britain and Northern Ireland'
                }, {
                    id: 2,
                    name: 'India'
                }])
            }),
            Ember.Object.create({
                idType: 'Adhar',
                id: 33,
                idNumber: 'JGKJBGSW78658',
                highlightBarColor: 'red',
                enityName: 'D',
                enityColor: 'green-500',
                fileComp: {
                    type: 'xls',
                    name: 'Sample File Name 3'
                },
                isValid: false,
                country: 'India',
                countries: Ember.A([{
                    id: 1,
                    name: 'India'
                }])
            })
        ]);
    },
    getActionMenuData() {
        return Ember.A([
            Ember.Object.create({
                idType: 'Passport',
                id: 11,
                isRowActionDisabled: false,
                idNumber: Ember.A([{
                    id: 1,
                    name: 'India'
                }]),
                enityName: 'D',
                enityColor: '',
                customField: 'google.com',
                customVCardField: this.getToolTipData(),
                isValid: true,
                isValidStatus: {
                    label: 'Valid',
                    color: 'green'
                },
                country: 'India',
                comments: 'N/A',
                isDisabled: true
            }),
            Ember.Object.create({
                idType: 'Document of United Kingdom of Great Britain and Northern Ireland',
                id: 22,
                idNumber: Ember.A([{
                    id: 1,
                    name: 'United Kingdom of Great Britain and Northern Ireland',
                }, {
                    id: 2,
                    name: 'Singapore',
                }]),
                enityName: 'G',
                enityColor: 'blue-500',
                customField: 'yahoo.com',
                customVCardField: this.getToolTipData(),
                isValid: false,
                isReadOnly: true,
                isRowActionDisabled: true,
                rowActions: {
                    items: Ember.A([{
                        label: "View",
                        action: "viewAction",
                        iconName: "info"
                    }, {
                        label: "New",
                        action: "newAction",
                        iconName: "add_circle"
                    }])
                },
                isValidStatus: {
                    label: 'In Valid',
                    color: 'deep-orange'
                },
                country: 'Singapore',
                comments: 'Invalid id number'
            }),
            Ember.Object.create({
                idType: 'Adhar',
                id: 33,
                idNumber: Ember.A([{
                    id: 1,
                    name: 'India',
                    isReadOnly: true
                }, {
                    id: 2,
                    name: 'Singapore'
                }]),
                enityName: 'D',
                enityColor: 'green-500',
                customField: 'google.com',
                customVCardField: this.getToolTipData(),
                rowActions: {
                    items: Ember.A([{
                        label: "View",
                        action: "viewAction",
                        iconName: "info"
                    }, {
                        label: "New",
                        action: "newAction",
                        iconName: "add_circle"
                    }]),
                    triggerElement: Ember.Object.create({
                        componentName: 'wb-md-icon',
                        config: Ember.Object.create({
                            iconName: 'more_vert'
                        })
                    })
                },
                isValid: false,
                isValidStatus: null,
                country: 'India',
                comments: 'Comments Here'
            })
        ]);
    },
    getCountries() {
        return Ember.A([
            Ember.Object.create({
                id: 1,
                name: 'Singapore'
            }),
            Ember.Object.create({
                id: 2,
                name: 'America'
            }),
            Ember.Object.create({
                id: 3,
                name: 'Japan'
            }),
            Ember.Object.create({
                id: 4,
                name: 'India'
            }),
            Ember.Object.create({
                id: 5,
                name: 'Malaysia'
            })
        ]);
    },
    getToolTipData() {
        return {
            name: 'Troy Tran (Troy)',
            avatar: 'data:image/png;base64,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',
            information: [
                'Executive Vice President',
                'Singapore',
                'AZTA-10094W'
            ],
            tags: [{
                    config: {
                        label: 'C-SUITE',
                        color: 'deep-purple'
                    }
                },
                {
                    config: {
                        label: 'REG',
                        color: 'cyan'
                    }
                }
            ]
        };
    }
});