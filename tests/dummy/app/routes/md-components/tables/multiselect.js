import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let filters = JSON.stringify({
            pagination: {
                page: 1,
                size: 5
            }
        });
        return this.get('store').query('user', {
            filters
        });
    },
    setupController(controller) {
        this._super(...arguments);
        controller.set('multiSelectItems', Ember.A());
        controller.set('multiSelectDataConfig', this.getMultiSelectTableConfig());
        controller.set('multiSelectModelSelectionConfig', this.getMultiSelectModelSelectionConfig());
        controller.set('selectionMenuConfig', this.getSelectionMenuConfig());
    },
    actions: {
        menuAction(actionName, content) {
            Ember.Logger.log(arguments, 'invoked');
            this.send(actionName, content);
        },
        tableSelectionChange() {
            Ember.Logger.log('Action from table select', ...arguments);
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
        exportAction(content) {
            Ember.Logger.log('exportAction Called in Route', content);
        },
        togglePropertyChanged() {
            Ember.Logger.log('togglePropertyChanged Called in Route', ...arguments);
        },
        newRowAdded() {
            Ember.Logger.log('newRowAdded Called in Route', this.get('controller.newUsers'));
        },
        rowExpandCollapseAction(row) {
            Ember.Logger.log('Expand Row called on ', row);
        },
        linkAction() {
            Ember.Logger.log('Link Action called', ...arguments);
        },
        checkboxMenuSelection(item) {
            Ember.Logger.log('checkboxMenuSelection called', item);
        },
        rowSelected() {
            Ember.Logger.log('rowSelected called', ...arguments);
        },
        selectAllCheckboxAction() {
            Ember.Logger.log('selectAllAction called', ...arguments);
        }
    },
    getMultiSelectTableConfig() {
        return {
            tableHeading: 'Selectable User Table',
            multiSelect: true,
            multiSelectAction: 'rowSelected',
            selectAllAction: 'selectAllCheckboxAction',
            disableSelectField: 'disableCheckbox',
            disableRowActionField: 'disableAction',
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            headerSelectedItemActions: {
                selectionText: 'Items Selected',
                items: [{
                    label: 'Edit',
                    action: 'editAction'
                }, {
                    label: 'Export',
                    action: 'exportAction'
                }]
            },
            content: this.getTableData(),
            columns: [{
                field: 'idType',
                type: 'text',
                title: 'ID Type'
            }, {
                field: 'idNumber',
                type: 'text',
                title: 'ID Number',
                isPriorityWidth: true,
            }, {
                field: 'isValid',
                type: 'boolean',
                title: 'Valid'
            }, {
                field: 'country',
                type: 'text',
                title: 'Country'
            }, {
                field: 'comments',
                type: 'text',
                title: 'Comments'
            }]
        };
    },
    getMultiSelectModelSelectionConfig() {
        let contentArray = this.currentModel.toArray();
        return {
            tableHeading: 'Selectable User Table',
            multiSelect: true,
            enableModelSelection: true,
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            headerSelectedItemActions: {
                selectionText: 'Items Selected',
                items: [{
                    label: 'Edit',
                    action: 'editAction'
                }, {
                    label: 'Export',
                    action: 'exportAction'
                }]
            },
            content: contentArray,
            columns: [{
                field: 'psId',
                type: 'text',
                title: 'PSID'
            }, {
                field: 'firstName',
                type: 'text',
                title: 'First Name',
                isPriorityWidth: true,
            }, {
                field: 'lastName',
                type: 'text',
                title: 'Last Name'
            }, {
                field: 'emailId',
                horizontalAlignment: 'right',
                type: 'text',
                title: 'Email Id'
            }, {
                field: 'userCountry',
                type: 'text',
                title: 'User Country'
            }]
        };
    },
    getSelectionMenuConfig() {
        let contentArray = this.currentModel.toArray();
        return {
            tableHeading: 'Selectable User Table',
            multiSelect: true,
            checkboxSelectionMenu: {
                action: 'checkboxMenuSelection',
                items: [{
                    deafultSelection: true,
                    label: 'Select view',
                    isSelected: false,
                    selectionLabel: 'Deselect View'
                }, {
                    label: 'Select all page',
                    isSelected: false,
                    isSelectAllPage: true,
                    selectionLabel: 'Deselect Page Selection'
                }]
            },
            enableModelSelection: true,
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            headerSelectedItemActions: {
                selectionText: 'Items Selected',
                items: [{
                    label: 'Edit',
                    action: 'editAction'
                }, {
                    label: 'Export',
                    action: 'exportAction'
                }]
            },
            content: contentArray,
            columns: [{
                field: 'psId',
                type: 'text',
                title: 'PSID'
            }, {
                field: 'firstName',
                type: 'text',
                title: 'First Name',
                isPriorityWidth: true,
            }, {
                field: 'lastName',
                type: 'text',
                title: 'Last Name'
            }, {
                field: 'emailId',
                horizontalAlignment: 'right',
                type: 'text',
                title: 'Email Id'
            }, {
                field: 'userCountry',
                type: 'text',
                title: 'User Country'
            }]
        };
    },
    getTableData() {
        return Ember.A([
            Ember.Object.create({
                idType: 'Passport',
                id: 11,
                disableCheckbox: true,
                idNumber: 'XYZKJH',
                enityName: 'D',
                enityColor: '',
                customField: 'google.com',
                isValid: true,
                country: 'India',
                comments: 'N/A'
            }),
            Ember.Object.create({
                idType: 'Voter ID',
                id: 22,
                disableAction: true,
                idNumber: 'JGKJBSW78658',
                enityName: 'G',
                enityColor: 'blue-500',
                customField: 'yahoo.com',
                isValid: false,
                country: 'Singapore',
                comments: 'Invalid id number'
            }),
            Ember.Object.create({
                idType: 'Adhar',
                id: 33,
                idNumber: 'JGKJBGSW78658',
                enityName: 'D',
                enityColor: 'green-500',
                customField: 'google.com',
                isValid: false,
                country: 'India',
                comments: 'Comments Here'
            })
        ]);
    }
});