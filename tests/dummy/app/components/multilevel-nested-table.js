import Ember from 'ember';
import layout from '../templates/components/multilevel-nested-table';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('multiLevelNestingTable', this.getParentTableConfig());
    },
    layout,
    multiLevelNestingTable: '',
    tableContent: Ember.A([
        Ember.Object.create({
            idType: 'Passport',
            id: 11,
            idNumber: 'Some very very long id number',
            enityConfig: {
                color: 'green-500',
                value: 'D',
                size: "medium"
            },
            nestedRows: Ember.A([
                Ember.Object.create({
                    isMultiSelect: true,
                    color: 'gray',
                    highlight: "orange-500",
                    entityName: 'GA: 0099423',
                    'someAction': 'someAction',
                    showActionMenu: true,
                    actionMenuConfig: {
                        items: Ember.A([
                            Ember.Object.create({
                                iconName: 'search',
                                label: 'View Details',
                                action: 'someAction'
                            }), Ember.Object.create({
                                iconName: "receipt",
                                label: "Update Section",
                                action: "someAction"
                            })
                        ])
                    },
                    label: 'VIEW DETAILS',
                    statusConfig: {
                        componentName: 'wb-md-tag',
                        componentConfig: {
                            label: 'IN-FLIGHT',
                            color: 'orange-500'
                        }
                    }
                }),
                Ember.Object.create({
                    isMultiSelect: true,
                    color: '',
                    cardColor: 'blue',
                    entityName: 'FM Accounts',
                    tableContent: Ember.A([Ember.Object.create({
                            product: 'ATLAS',
                            status: 'Active'
                        }),
                        Ember.Object.create({
                            product: 'ATLAS 2',
                            status: 'In Active'
                        })
                    ]),
                    tableConfig: {
                        multiSelect: true,
                        hideToolabr: true,
                        hideSelectAll: true,
                        pageable: true,
                        pageType: 'loadmore',
                        totalRecords: 6,
                        columns: [{
                            field: 'product',
                            title: 'Product'
                        }, {
                            field: 'status',
                            title: 'Status'
                        }]
                    }
                }),
                Ember.Object.create({
                    isMultiSelect: true,
                    color: '',
                    cardColor: 'green',
                    highlight: "indigo-500",
                    entityName: 'BBA Cases Accounts',
                    tableContent: Ember.A([Ember.Object.create({
                            product: 'ATLAS',
                            status: 'Active'
                        }),
                        Ember.Object.create({
                            product: 'ATLAS 2',
                            status: 'In Active'
                        })
                    ]),
                    tableConfig: {
                        multiSelect: true,
                        hideToolabr: true,
                        hideSelectAll: true,
                        columns: [{
                            field: 'product',
                            title: 'Product'
                        }, {
                            field: 'status',
                            title: 'Status'
                        }]
                    }
                })
            ]),
            product: 'ATLAS',
            tpAccNo: '12345',
            location: 'IN/SBCML1',
            isValid: true,
            country: 'India',
            comments: 'N/A'
        }),
        Ember.Object.create({
            idType: 'Voter ID',
            id: 22,
            idNumber: 'JGKJBSW78658',
            enityConfig: {
                color: 'blue-500',
                value: 'G',
                size: "medium"
            },
            isValid: false,
            product: 'ATLAS',
            tpAccNo: '12346',
            location: 'SG/SCBL',
            country: 'Singapore',
            comments: 'Invalid id number'
        }),
        Ember.Object.create({
            idType: 'Adhar',
            id: 33,
            idNumber: 'JGKJBGSW78658',
            enityConfig: {
                color: 'amber-500',
                value: 'D',
                size: "medium"
            },
            isValid: false,
            product: 'ATLAS',
            tpAccNo: '12347',
            location: 'MY/SBCML',
            country: 'India',
            comments: 'Comments Here'
        })
    ]),
    getParentTableConfig() {
        return {
            tableHeading: 'Multi level Nested Table',
            content: this.get('tableContent'),
            multiSelect: true,
            isNestingTable: true,
            entityNameField: 'idType',
            filterable: true,
            sortable: true,
            filterConditions: ['contains', 'equal'],
            nestedTableConfig: this.getSecondNesting(),
            nestedRowsConfig: {
                rowExpandAction: 'rowsExpanded',
                nestedRowsField: 'nestedRows',
                isSelectedField: 'isSelected',
                label: 'label',
                action: 'someAction',
                tableConfigField: 'tableConfig',
                tableContent: 'tableContent',
                iconToolbarConfig: {
                    items: Ember.A()
                },
                enityConfigField: 'enityConfig',
                name: 'entityName',
                rowColorField: 'color'
            },
            columns: [{
                field: 'idType',
                type: 'link',
                action: 'linkAction',
                title: 'ID Type'
            }, {
                field: 'idNumber',
                isPriorityWidth: true,
                action: 'linkAction',
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
            }]
        };
    },
    getSecondNesting() {
        return {
            tableHeading: 'Locations',
            isMultilevelTable: true,
            childTableConfig: this.getThirdNesting(),
            pageType: 'loadmore',
            pageable: true,
            queryActionName: 'childQueryAction',
            selectAllAction: 'tableSelectionChange',
            totalRecords: 10,
            nestedRowsConfig: {
                nestedRowsField: 'nestedRows',
                label: 'label',
                action: 'someAction',
                name: 'entityName',
                rowColorField: 'color'
            },
            content: Ember.A([
                Ember.Object.create({
                    idType: 'Passport',
                    nestedRows: Ember.A([
                        Ember.Object.create({
                            color: 'gray',
                            entityName: 'GA: 0099423',
                            'someAction': 'someAction',
                            label: 'VIEW DETAILS'
                        })
                    ]),
                    id: 11,
                    idNumber: 'XYZKJH',
                    product: 'ATLAS',
                    tpAccNo: '12345',
                    location: 'IN/SBCML2',
                    isValid: true,
                    country: 'India',
                    comments: 'N/A'
                })
            ]),
            multiSelect: true,
            entityNameField: 'idType',
            columns: [{
                field: 'location',
                isPriorityWidth: true,
                type: 'text',
                title: 'Location'
            }, {
                field: 'country',
                title: 'PFAM Country'
            }, {
                field: 'idType',
                type: 'text',
                title: 'ID Type'
            }]
        };
    },
    getThirdNesting() {
        return {
            tableHeading: 'Third Level Nesting',
            selectAllAction: 'tableSelectionChange',
            pageType: 'loadmore',
            pageable: true,
            totalRecords: 4,
            queryActionPromise: function () {
                Ember.Logger.log('bef getThirdNesting promise');
                return new Ember.RSVP.Promise(function (resolve) {
                    // on success
                    Ember.Logger.log('getThirdNesting promise');
                    resolve([]);
                });
            },
            content: Ember.A([
                Ember.Object.create({
                    idType: 'Passport',
                    id: 11,
                    idNumber: 'XYZKJH',
                    product: 'ATLAS',
                    tpAccNo: '12345',
                    location: 'IN/SBCML3',
                    isValid: true,
                    country: 'India',
                    comments: 'N/A'
                })
            ]),
            multiSelect: true,
            entityNameField: 'idType',
            columns: [{
                field: 'location',
                isPriorityWidth: true,
                type: 'text',
                title: 'Location'
            }, {
                field: 'country',
                title: 'PFAM Country'
            }, {
                field: 'idType',
                type: 'text',
                title: 'ID Type'
            }]
        };
    },
    actions: {
        someAction() {
            Ember.Logger.log('some action called', ...arguments);
        },
        rowsExpanded() {
            Ember.Logger.log('nested rows expanded', ...arguments);
        },
        tableSelectionChange() {
            Ember.Logger.log('Action from table select', ...arguments);
        },
        thirdNestingAction() {
            Ember.Logger.log('childQueryAction from child');
            return new Ember.RSVP.Promise(function (resolve) {
                // on success
                resolve([]);
            });
        },
        childQueryAction() {
            Ember.Logger.log('childQueryAction from child');
            return new Ember.RSVP.Promise(function (resolve) {
                // on success
                resolve([]);
            });
        }
    }
});