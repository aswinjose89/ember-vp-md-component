import Ember from 'ember';
import layout from '../templates/components/infinte-scroll-pageable-table';

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
        }
    },
    getTableConfig() {
        return {
            tableHeading: 'User table with Pagination',
            pageable: true,
            pageType: 'infinite',
            pageSize: 10,
            rowsPerPage: [10, 20, 30],
            sortable: true,
            priorityColumns: true,
            headerToolBar: {
                enableTableSearch: true,
                enableShowHideColumn: true,
                downloadAction: 'downloadAction',
                items: [{
                    iconName: 'save',
                    action: 'saveAction',
                    label: 'Save View'
                }, {
                    iconName: 'refresh',
                    action: 'resetAction',
                    label: 'Reset View'
                }]
            },
            filterable: true,
            filterConditions: ['contains', 'equal'],
            content: this.get('tableContent'),
            columns: [{
                field: 'psId',
                type: 'text',
                title: 'PSID'
            }, {
                field: 'firstName',
                type: 'text',
                title: 'First Name'
            }, {
                field: 'lastName',
                type: 'text',
                title: 'Last Name'
            }, {
                field: 'emailId',
                type: 'text',
                title: 'Email Id'
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