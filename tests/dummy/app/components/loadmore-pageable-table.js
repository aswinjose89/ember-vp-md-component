import Ember from 'ember';
import layout from '../templates/components/loadmore-pageable-table';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    mockNoDataCount: 1,
    init() {
        this._super(...arguments);
        let tableConfig = this.getTableConfig();
        this.set('tableConfig', tableConfig);
    },
    actions: {
        userQueryAction(filters) {
            return this.get('store').query('user', { filters });
        },
        downloadAction(param) {
            Ember.Logger.log('Download Action triggered', param);
        },
        saveAction() {
            Ember.Logger.log('saveAction triggered');
        },
        resetAction() {
            Ember.Logger.log('resetAction triggered');
        },
        deleteAction(content) {
            Ember.Logger.log('deleteAction Called in Route', content);
            content.deleteRecord();
            this.get('tableContent').removeObject(content);
        },
        exportAll() {
            Ember.Logger.log('exportAll triggered', ...arguments);
        }
    },
    getTableConfig() {
        return {
            tableHeading: 'User table from remote API',
            pageable: true,
            pageType: 'loadmore',
            sortable: true,
            pageSize: 10,
            priorityColumns: true,
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            headerToolBar: Ember.Object.create({
                enableTableSearch: true,
                disableTableDownload: true,
                customActionMenuConfig: Ember.Object.create({
                    triggerElement: Ember.Object.create({
                        componentName: 'wb-md-icon',
                        config: Ember.Object.create({
                            iconName: 'get_app',
                            helpText: 'Export'
                        })
                    }),
                    items: Ember.A([
                        Ember.Object.create({
                            iconName: 'get_app',
                            label: 'Export All',
                            action: 'exportAll'
                        }), Ember.Object.create({
                            iconName: "receipt",
                            label: "By Report",
                            type: "parent",
                            isNotTrigger: true,
                            disableSelection: true,
                            items: Ember.A([
                                Ember.Object.create({
                                    label: 'Enquiry',
                                    iconName: "get_app",
                                    action: 'exportAll'
                                }), Ember.Object.create({
                                    label: "Audit Trail",
                                    iconName: "get_app",
                                    action: "exportAll"
                                })
                            ])
                        })
                    ])
                }),
                enableShowHideColumn: true
            }),
            filterable: true,
            minColumnCount: 3,
            filterConditions: ['contains', 'equal'],
            content: this.get('tableContent'),
            columns: [{
                field: 'psId',
                type: 'text',
                title: 'PSID'
            }, {
                field: 'firstName',
                isPriorityWidth: true,
                type: 'text',
                title: 'First Name'
            }, {
                field: 'lastName',
                type: 'text',
                title: 'Last Name'
            }, {
                field: 'createdDate',
                type: 'date',
                filterType: 'date',
                filterConfig: Ember.Object.create({
                    enableCentralizedTimeZone: true
                }),
                title: 'Created Date'
            }, {
                field: 'emailId',
                type: 'text',
                title: 'Email Id'
            }, {
                field: 'nationalities',
                type: 'array',
                arrayLabelPath: 'name',
                title: 'Nationalities',
            }, {
                field: 'userCountry',
                type: 'text',
                title: 'User Country'
            }, {
                field: 'jobTitle',
                type: 'boolean',
                title: 'Job Title'
            }, {
                field: 'department',
                type: 'text',
                title: 'Department'
            }]
        };
    }
});