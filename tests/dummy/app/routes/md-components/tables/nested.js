import Ember from 'ember';
import MaterialLayoutHandler from 'wb-ui-md-components/mixins/material-layout-handler';

export default Ember.Route.extend(MaterialLayoutHandler, {
    isMDLayoutFullWidth: false,
    isMDFluidLayout: true,
    showMDToggleSideBar: true,
    setupController(controller) {
        this._super(...arguments);
        controller.set('tempToggleProperty', true);
        controller.set('iconToolbarConfig', Ember.Object.create({
            visibleItems: '0',
            toggledProperty: this.controller.get('tempToggleProperty'),
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
                        iconName: 'delete_forever',
                        label: 'Delete',
                        action: 'iconToolbarAction'
                    }
                }),
            ])
        }));
        controller.set('multiSelectItems', Ember.A());
        var simpleNestedTableConfig = this.getParentTableConfig();
        simpleNestedTableConfig.multiSelect = false;
        simpleNestedTableConfig.nestedTableConfig.multiSelect = false;
        simpleNestedTableConfig.iconToolbarConfig = Ember.Object.create({
            visibleItems: '0',
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
                        iconName: 'delete_forever',
                        label: 'Delete',
                        action: 'iconToolbarAction'
                    }
                }),
            ])
        });
        simpleNestedTableConfig.rowHeaderField = 'idType';
        simpleNestedTableConfig.entityConfigField = 'enityConfig';
        simpleNestedTableConfig.tableHeading = "Simple Parent Table";
        simpleNestedTableConfig.nestedTableConfig.tableHeading = "Simple Child Table";

        var selectableNestedTableConfig = this.getParentTableConfig();
        selectableNestedTableConfig.tableHeading = "Selectable Parent Table";
        selectableNestedTableConfig.multiSelectAction = 'tableSelectionChange';
        selectableNestedTableConfig.entityConfigField = "enityConfig";
        selectableNestedTableConfig.entityNameField = "idType";
        selectableNestedTableConfig.nestedTableConfig.tableHeading = "Selectable Child Table";
        selectableNestedTableConfig.nestedTableConfig.queryActionName = 'childQueryAction';
        controller.set('simpleNestedTableConfig', simpleNestedTableConfig);
        controller.set('selectableNestedTableConfig', selectableNestedTableConfig);
    },
    getTableConfig() {
        var tableContent = Ember.A([
            Ember.Object.create({
                idType: 'Passport',
                id: 11,
                idNumber: 'XYZKJH',
                isToggleDisabled: true,
                enityName: 'D',
                enityColor: '',
                customField: 'google.com',
                enityConfig: {
                    color: 'green-500',
                    value: 'D',
                    size: "medium"
                },
                isValid: true,
                isValidStatus: {
                    label: 'Valid',
                    color: 'green'
                },
                country: 'India',
                comments: 'N/A'
            }),
            Ember.Object.create({
                idType: 'Voter ID',
                id: 22,
                idNumber: 'JGKJBSW78658',
                enityName: 'G',
                enityColor: 'blue-500',
                customField: 'yahoo.com',
                enityConfig: {
                    color: 'blue-500',
                    value: 'G',
                    size: "medium"
                },
                isValid: false,
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
                idNumber: 'JGKJBGSW78658',
                enityName: 'D',
                enityColor: 'green-500',
                customField: 'google.com',
                enityConfig: {
                    color: 'amber-500',
                    value: 'D',
                    size: "medium"
                },
                isValid: false,
                isValidStatus: {
                    label: 'In Valid',
                    color: 'deep-orange'
                },
                country: 'India',
                comments: 'Comments Here'
            })
        ]);
        return {
            tableHeading: 'User Table',
            content: tableContent,
            columns: [{
                field: 'idType',
                type: 'link',
                action: 'linkAction',
                title: 'ID Type'
            }, {
                field: 'idNumber',
                type: 'entityLink',
                enityIconFiled: 'enityName',
                entityColorField: 'enityColor',
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
                title: 'Status'
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
    getParentTableConfig() {
        let parentTableConfig = this.getTableConfig();
        parentTableConfig.multiSelect = true;
        parentTableConfig.isNestingTable = true;
        parentTableConfig.pageable = true;
        parentTableConfig.pageType = 'default';
        parentTableConfig.pageSize = 10;
        parentTableConfig.content.meta = {
            totalRecords: 3
        };
        parentTableConfig.rowsPerPage = [10, 20, 30, 50];
        parentTableConfig.rowExpandAction = "rowExpandCollapseAction";
        parentTableConfig.tableHeading = 'Nested Table - Parent';
        parentTableConfig.entityField = 'enityConfig';
        parentTableConfig.rowAction = {
            iconName: "remove_circle",
            action: 'deleteAction'
        };
        parentTableConfig.headerSelectedItemActions = {
            selectionText: 'Items Selected',
            items: [{
                label: 'Edit',
                action: 'editAction'
            }, {
                label: 'Export',
                action: 'exportAction'
            }]
        };
        parentTableConfig.columns = [{
            field: 'enityConfig',
            type: 'component',
            componentName: 'wb-md-entity-icon'
        }, {
            field: 'idType',
            type: 'text',
            title: 'ID Type',
            isPriorityWidth: true
        }, {
            field: 'id',
            type: 'text',
            title: 'ID'
        }, {
            field: 'idNumber',
            type: 'text',
            title: 'ID Number',
            align: 'right'
        }, {
            field: 'country',
            type: 'text',
            title: 'Country',
            horizontalAlignment: 'right'
        }, {
            field: 'comments',
            type: 'text',
            title: 'Comments'
        }];
        parentTableConfig.nestedTableConfig = this.getNestedChildTableConfig();
        return parentTableConfig;
    },
    getNestedChildTableConfig() {
        let staticTableConfig = this.getChildTableConfig();
        staticTableConfig.multiSelect = true;
        staticTableConfig.columns = [{
            field: 'idType',
            type: 'text',
            title: 'ID Type',
            isPriorityWidth: true
        }, {
            field: 'idNumber',
            type: 'text',
            title: 'ID Number'
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
        }];
        return staticTableConfig;
    },
    getChildTableConfig() {
        var tableContent = Ember.A([
            Ember.Object.create({
                idType: 'Passport',
                id: 11,
                idNumber: 'XYZKJH',
                customField: 'google.com',
                isValid: true,
                isValidStatus: {
                    label: 'Valid',
                    color: 'green'
                },
                country: 'India',
                comments: 'N/A'
            }),
            Ember.Object.create({
                idType: 'Voter ID',
                id: 22,
                idNumber: 'JGKJBSW78658',
                customField: 'yahoo.com',
                isValid: false,
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
                idNumber: 'JGKJBGSW78658',
                customField: 'google.com',
                isValid: false,
                isValidStatus: {
                    label: 'In Valid',
                    color: 'deep-orange'
                },
                country: 'India',
                comments: 'Comments Here'
            })
        ]);
        tableContent.meta = {
            totalRecords: 3
        };
        return {
            tableHeading: 'Nested Child Table',
            content: tableContent,
            pageable: true,
            rowsPerPage: [10],
            pageType: 'default',
            columns: [{
                field: 'idType',
                type: 'link',
                title: 'ID Type'
            }, {
                field: 'idNumber',
                type: 'text',
                title: 'ID Number'
            }, {
                field: 'isValidStatus',
                type: 'component',
                componentName: 'wb-md-tag',
                title: 'Status'
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
    actions: {
        iconToolbarAction() {
            console.log("Some row action");
        }
    }
});