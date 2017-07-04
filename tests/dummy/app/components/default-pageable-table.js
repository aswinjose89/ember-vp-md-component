import Ember from 'ember';
import layout from '../templates/components/default-pageable-table';

export default Ember.Component.extend({
    layout,
    filters: Ember.Object.create({ disableQueryAction: false }),
    store: Ember.inject.service(),
    mockNoDataCount: 1,
    startDate: '',
    endDate: '',
    headerToolBar: Ember.Object.create({
        enableShowHideColumn: true,
        minColumnCount: 3,
        disableTableSearch: true,
        disableTableDownload: true,
        downloadAction: 'exportAction',
        dropdowns: Ember.A([
            Ember.Object.create({
                action: 'tableHeaderSelectionChange',
                iconName: 'arrow_drop_down',
                placeholder: 'Select Month',
                value: Ember.Object.create({ id: 2, name: 'Feb' }),
                optionLabelPath: 'name',
                disableResetSelection: true,
                content: Ember.A([
                    Ember.Object.create({ id: 1, name: 'Jan' }),
                    Ember.Object.create({ id: 2, name: 'Feb' }),
                    Ember.Object.create({ id: 3, name: 'Mar' }),
                    Ember.Object.create({ id: 4, name: 'Apr' })
                ])
            })
        ]),
        items: [{
            iconName: 'save',
            action: 'saveAction',
            isDisabled: true,
            label: 'Save View'
        }, {
            iconName: 'refresh',
            action: 'resetAction',
            label: 'Reset View'
        }]
    }),
    init() {
        this._super(...arguments);
        let tableConfig = this.getTableConfig();
        this.set('tableConfig', tableConfig);
    },
    actions: {
        getFilters() {
            Ember.Logger.log('Filters', this.get('filters'));
        },
        resetFilters() {
            this.get('filters').resetAll();
            Ember.Logger.log('Filters', this.get('filters'));
        },
        userQueryAction(filters) {
            Ember.Logger.log('filters', filters);
            return this.get('store').query('user', { filters });
        },
        exportAction(param) {
            Ember.Logger.log('Download Action exportAction triggered', param);
        },
        saveAction() {
            Ember.Logger.log('saveAction triggered');
        },
        resetAction() {
            Ember.Logger.log('resetAction triggered');
        },
        tableHeaderSelectionChange() {
            Ember.Logger.log('tableHeaderSelectionChange', ...arguments);
        },
        changeMonth() {
            let headerToolBarDropdown = this.get('headerToolBar.dropdowns')[0];
            headerToolBarDropdown.set('value', headerToolBarDropdown.get('content.firstObject'));
        }
    },
    getFilters() {
        return Ember.A([{
            id: 1,
            label: 'Singapore',
            isSelected: false
        }, {
            id: 2,
            label: 'Malaysia',
            isSelected: true
        }, {
            id: 3,
            label: 'Japan',
            isSelected: false
        }, {
            id: 4,
            label: 'Spain',
            isSelected: false
        }, {
            id: 5,
            label: 'Indonesia',
            isSelected: false
        }, {
            id: 6,
            label: 'India',
            isSelected: false
        }, {
            id: 7,
            label: 'Bahrain',
            isSelected: false
        }, {
            id: 8,
            label: 'Bosnia and Herzegovina',
            isSelected: false
        }, {
            id: 9,
            label: 'Central African Republic',
            isSelected: false
        }, {
            id: 10,
            label: 'Congo, Democratic Republic of the (D.R.C.)',
            isSelected: false
        }]);
    },
    getTableConfig() {
        return {
            tableHeading: 'User table with Pagination',
            pageable: true,
            pageType: 'default',
            pageSize: 10,
            isEmptyTableWithControls: true,
            filters: this.get('filters'),
            rowsPerPage: [10, 20, 30],
            sortable: true,
            priorityColumns: true,
            filterable: true,
            filterConditions: ['contains', 'equal'],
            content: this.get('tableContent'),
            minColumnCount: 4,
            maxColumnCount: 5,
            columns: [{
                field: 'psId',
                type: 'text',
                showAlways: true,
                title: 'PSID'
            }, {
                field: 'firstName',
                type: 'text',
                isFilterable: false,
                isSortable: false,
                title: 'First Name'
            }, {
                field: 'lastName',
                type: 'text',
                isHidden: true,
                title: 'Last Name'
            }, {
                field: 'emailId',
                type: 'text',
                isPriorityWidth: true,
                title: 'Email Id'
            }, {
                field: 'createdDate',
                type: 'date',
                title: 'Created Date',
                filterType: 'custom',
                filterConfig: Ember.Object.create({
                    filterValuePath: 'dateValue',
                    items: Ember.A([
                        Ember.Object.create({
                            type: 'datepicker',
                            dateValue: this.get('startDate'),
                            label: 'Start Date'
                        }),
                        Ember.Object.create({
                            type: 'datepicker',
                            dateValue: this.get('endDate'),
                            label: 'End Date'
                        })
                    ])
                }),
            }, {
                field: 'userCountry',
                type: 'text',
                filterType: 'dropdown',
                filterConfig: Ember.Object.create({
                    filterValuePath: 'values',
                    isMultiselect: true,
                    optionLabelPath: 'label',
                    optionValuePath: 'id',
                    content: this.getFilters()
                }),
                title: 'User Country'
            }, {
                field: 'department',
                type: 'text',
                isHidden: true,
                title: 'Department'
            }]
        };
    }
});