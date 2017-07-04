import Ember from 'ember';
import layout from '../templates/components/wb-md-table';
import ComponentHelper from '../mixins/component-helper';
import TableComponent from '../classes/table/TableComponent';
import MultiSelectTableComponent from '../classes/table/MultiSelectTable';
import EditableTableComponent from '../classes/table/EditableTable';
import ScrollListener from '../mixins/scroll-listener';
import ClickOutside from '../mixins/click-outside';

export default Ember.Component.extend(ComponentHelper, ScrollListener, ClickOutside, {
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        this.reopen(TableComponent);
        this.setupTable();
        this.initFilteredContent();
        this.initColumns();
        this.initHeaderToolbar();
    },
    type: 'static',
    addRowLabel: '+ Add More',
    tableEmptyMessage: Ember.computed('isEmptyTableWithControls', function () {
        return this.get('isEmptyTableWithControls') ? 'No data available' : "Add your record using the 'ADD' button";
    }),
    tableNoResultMessage: 'No results found. Update or Reset your Filter Criteria',
    tableEmptyMessageBorder: true,
    disableNestedTableAutoCollapse: false,
    isMultiSelect: Ember.computed.alias('multiSelect'),
    setupTable() {
        if (this.get('isMultiSelect')) {
            this.reopen(MultiSelectTableComponent);
            this.initMultiSelect();
        }
        switch (this.get('type')) {
            case 'editable':
                this.reopen(EditableTableComponent);
                this.initEditableTable();
                break;
            default:

        }
    },
    customQueryAction: Ember.computed('nestedTableConfig.queryActionName', 'nestedTableConfig.queryActionPromise', {
        get() {
            if (Ember.isPresent(this.get('nestedTableConfig.queryActionPromise'))) {
                return this.get('nestedTableConfig.queryActionPromise');
            } else if (Ember.isPresent(this.get('nestedTableConfig.queryActionName'))) {
                let queryAction = Ember.get(this, this.get('nestedTableConfig.queryActionName'));
                if (Ember.isEmpty(queryAction)) {
                    Ember.assert('Please provide the closure action as specifed in the nestedTableConfig.queryActionName');
                }
                return queryAction;
            } else {
                //dummy function for the closure action if no queryAction is found
                return function () {};
            }
        }
    }),
    computedChildTableConfig: Ember.computed('config.childTableConfig', 'config.nestedTableConfig', {
        get() {
            if (Ember.isPresent(this.get('childTableConfig'))) {
                this.set('nestedTableConfig', this.get('childTableConfig'));
                return this.get('childTableConfig');
            }
            return this.get('nestedTableConfig');
        }
    }),
    computedNestedRowQueryAction: Ember.computed('nestedRowQueryAction', {
        get() {
            if (Ember.isPresent(this.get('nestedRowQueryAction'))) {
                return this.get('nestedRowQueryAction');
            }
            return function () {};
        }
    }),
    initFilteredContent() {
        let content = (Ember.typeOf(this.get('content')) === 'instance') ? this.get('content').toArray() : this.get('content');
        this.set('filteredContent', content);
        if (Ember.isEmpty(content)) {
            return;
        }
        if (this.get('isNestingTable') && !this.get('disableNestedTableAutoCollapse')) {
            this.get('filteredContent').setEach('toggledProperty', false);
        }
        if (this.get('isMultiSelect')) {
            this.setupMultiSelectContent();
        }
    },
    layout,
    shadowCellHeader: Ember.computed('sortable', 'pageable', {
        get() {
            let isShadowed = this.get('sortable') || this.get('sortable');
            if (isShadowed) {
                return true;
            }
            return;
        }
    }),
    classNames: ['global-table'],
    classNameBindings: [
        'isLoading:global-table_status_loading',
        'shadowCellHeader:global-table_status_filterable'
    ],
    pagable: false,
    pageable: Ember.computed.alias('pagable'),
    pageType: 'default',
    uniqueColumn: 'id',
    isChecked: 'isChecked',
    isDisabled: 'isDisabled',
    disableSelectField: 'isDisabled',
    hideToolbar: Ember.computed.bool('isNestedChildTable'),
    nestedTableToolBarColor: 'light-gray',
    enableMultipleNestedTableRows: false,
    tableToolbarIconToolbarVisibleItems: 2,
    isManageColumnAsActionMenu: Ember.computed('headerToolBar.items.[]', 'headerToolBar.enableShowHideColumn', function () {
        return Ember.isPresent(this.get('headerToolBar.items')) && this.get('headerToolBar.enableShowHideColumn');
    }),
    computedTableToolbarIconToolbarVisibleItems: Ember.computed('tableToolbarIconToolbarVisibleItems', 'headerToolBar.disableTableDownload', 'headerToolBar.customActionMenuConfig', 'isManageColumnAsActionMenu', function () {
        if (this.get('headerToolBar.disableTableSearch')) {
            this.decrementProperty('tableToolbarIconToolbarVisibleItems');
        }
        if (this.get('headerToolBar.disableTableDownload')) {
            this.decrementProperty('tableToolbarIconToolbarVisibleItems');
        }
        if (this.get('headerToolBar.customActionMenuConfig')) {
            this.incrementProperty('tableToolbarIconToolbarVisibleItems');
        }
        return this.get('tableToolbarIconToolbarVisibleItems');
    }),
    tableToolbarColor: Ember.computed('showMultiSelectActions', 'hideTableOnOnEmptyState', 'shadowCellHeader', {
        get() {
            if (this.get('showMultiSelectActions')) {
                return 'light-blue';
            } else if (!this.get('hideTableOnOnEmptyState') && this.get('shadowCellHeader')) {
                return 'light-gray';
            }
        }
    }),
    tableToolbarIconToolbarConfig: Ember.computed(function () {
        return Ember.Object.create({
            visibleItems: this.get('computedTableToolbarIconToolbarVisibleItems'),
            items: Ember.A()
        });
    }),
    iconToolbarConfig: Ember.computed(function () {
        return Ember.Object.create({
            visibleItems: 2,
            items: Ember.A()
        });
    }),
    enableScrollListener: Ember.computed('pageType', function () {
        return this.get('pageType') === 'infinite';
    }),
    isLoading: Ember.computed.bool('loading'),
    content: Ember.computed(function () { return Ember.A(); }),
    pageSize: Ember.computed.alias('filters.pagination.size'),
    defaultPageSize: Ember.computed('pageSize', function () {
        return Ember.isPresent(this.get('pageSize')) ? this.get('pageSize') : 20;
    }),
    page: Ember.computed.alias('filters.pagination.page'),
    enableModelSelection: false,
    loading: false,
    resolved: false,
    rejected: false,
    lastPage: false,
    hideSelectAll: false,
    childContentKey: 'childContent',
    selectedItems: Ember.computed(function () { return Ember.A(); }),
    headerActionToolbarCount: 3,
    filterValuePath: 'value',
    maxColumnCount: 5,
    minColumnCount: 1,
    displayColumnCount: Ember.computed('maxColumnCount', 'columns.@each.showAlways', {
        get() {
            let nonHiddenColumn = Ember.A(this.get('columns')).filterBy('showAlways', true),
                nonHiddenColumnCount = 0;
            if (Ember.isPresent(nonHiddenColumn)) {
                nonHiddenColumnCount = Ember.get(nonHiddenColumn, 'length');
            }
            return this.get('maxColumnCount') + nonHiddenColumnCount;
        }
    }),
    selectedIds: Ember.computed(function () { return Ember.A(); }),
    filteredContent: Ember.computed(function () { return Ember.A(); }),
    filters: Ember.computed(function () { return Ember.Object.create(); }),
    showLoadMore: Ember.computed('pageType', 'lastPage', 'isLoadMoreRecords', function () {
        if ((this.get('pageType') === 'loadmore') && !this.get('lastPage') && this.get('isLoadMoreRecords')) {
            return true;
        }
        return false;
    }),
    disableAddNewRow: false,
    totalRecords: Ember.computed('content.meta.totalRecords', function () {
        let totalRecords = this.get('content.meta.totalRecords');
        return Ember.isEmpty(totalRecords) ? 0 : totalRecords;
    }),
    isLoadMoreRecords: Ember.computed('totalRecords', 'filteredContent.[]', function () {
        return (this.get('content.length') > 0) && this.get('totalRecords') > this.get('filteredContent.length');
    }),
    startingRecordNumber: Ember.computed('page', 'pageSize', function () {
        return this.get('pageSize') * (this.get('page') - 1) + 1;
    }),
    endingRecordNumber: Ember.computed('page', 'pageSize', 'totalRecords', function () {
        let pageMax = this.get('pageSize') * this.get('page'),
            items = this.get('totalRecords');
        return Math.min(pageMax, items);
    }),
    didContentChanged: Ember.observer('content.[]', function () {
        this.initFilteredContent();
    }),
    showEmptyTableState: Ember.computed('loading', 'filteredContent.[]', {
        get() {
            return Ember.isEmpty(this.get('filteredContent')) && !this.get('loading');
        }
    }),
    showPagination: Ember.computed('pageable', 'loading', 'filteredContent.length', 'page', 'pageSize', {
        get() {
            let pageSize = this.get('pageSize'),
                pageNumber = this.get('page'),
                filteredContentLength = this.get('filteredContent.length');
            if ((pageNumber <= 1) && (filteredContentLength < pageSize)) {
                return false;
            }
            return this.get('pageable') && !this.get('loading');
        }
    }),
    hideTableOnOnEmptyState: Ember.computed('filteredContent.[]', 'filterable', 'sortable', 'resolved', {
        get() {
            if (Ember.isEmpty(this.get('filteredContent')) && !this.get('resolved') && !this.get('loading') && !this.get('isEmptyTableWithControls')) {
                return true;
            } else {
                return !(this.get('filterable') || this.get('sortable')) && Ember.isEmpty(this.get('filteredContent'));
            }
        }
    }),
    didFilteredContentDeleted: Ember.observer('filteredContent.@each.isDeleted', function () {
        let deletedContent, filteredContent = this.get('filteredContent');
        if (Ember.isEmpty(filteredContent)) {
            return;
        }
        deletedContent = filteredContent.filterBy('isDeleted', true);
        this.get('filteredContent').removeObjects(deletedContent);

    }),
    disableNextPage: Ember.computed('page', 'totalRecords', 'pageSize', function () {
        return this.get('pageSize') * this.get('page') >= this.get('totalRecords');
    }),
    visibleColumns: Ember.computed('columns.@each.isHidden', function () {
        let visibleColumns;
        if (this.get('enableShowHideColumn')) {
            visibleColumns = Ember.A(this.get('columns')).filterBy('isHidden', false);
        } else {
            visibleColumns = this.get('columns');
        }
        return visibleColumns;
    }),
    visibleColumnCount: Ember.computed('visibleColumns', function () {
        let visibleColumns = this.get('visibleColumns'),
            visibleColumnCount = Ember.get(visibleColumns, 'length');
        if (Ember.isPresent(this.get('rowAction')) || Ember.isPresent(this.get('rowActions'))) {
            visibleColumnCount++;
        }
        if (this.get('isMultiSelect')) {
            visibleColumnCount++;
        }
        if (this.get('isNestingTable') || this.get('isNestedCard')) {
            visibleColumnCount++;
        }
        return visibleColumnCount;
    }),
    hasNesting: Ember.computed('isNestingTable', 'isMultilevelTable', 'isMultilevelTab', 'isNestedCard', {
        get() {
            return this.get('isNestingTable') || this.get('isMultilevelTable') || this.get('isMultilevelTab') || this.get('isNestedCard');
        }
    }),
    disablePrevPage: Ember.computed.lte('page', 1),
    filtersDropDown: Ember.computed('filterConditions', function () {
        if (Ember.isEmpty(this.get('filterConditions')) && !this.get('filterable')) {
            return;
        }
        return this.get('filterConditions').map(item => {
            return { id: item, label: item };
        });
    }),
    rowsPerPageDropDown: Ember.computed('rowsPerPage', 'pageType', function () {
        if (Ember.isEmpty(this.get('rowsPerPage')) && this.get('pageType') !== 'default') {
            return;
        }
        return this.get('rowsPerPage').map(item => {
            return { id: item, label: item };
        });
    }),
    isPriorityWidthColumn: Ember.computed('priorityColumns', function () {
        return this.get('priorityColumns') ? 'global-table__cell_priority-width' : '';
    }),

    showMultiSelectActions: Ember.computed('isMultiSelect', 'selectionCount', function () {
        if (!this.get('isMultiSelect') || Ember.isEmpty(this.get('headerSelectedItemActions'))) {
            return;
        }
        return this.get('selectionCount') > 0;
    }),
    modelSelectionCount: Ember.computed('filteredContent.@each.isChecked', function () {
        return Ember.get(this.get('filteredContent').filterBy(this.get('isChecked'), true), 'length');
    }),
    selectionCount: 0,
    nestedTableRowsCardColor: Ember.computed('filteredContent.@each.nestedRows.length', {
        get() {
            this.get('filteredContent').forEach(content => {
                if (Ember.isPresent(content) && content.get('nestedRows')) {
                    content.get('nestedRows').forEach(nestedRow => {
                        if (Ember.isPresent(nestedRow.get('cardColor'))) {
                            nestedRow.set('cardColorClass', ` material_background_${nestedRow.get('cardColor')}-50`);
                        }
                    });
                }
            });
        }
    }),
    clickOutside() {
        this.send('hideFilters');
    },
    actions: {
        showToolTip(data, helpText) {
            let isHelpText = !Ember.isEmpty(helpText);
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: isHelpText ? false : true
            });
        },
        showHelpText(data) {
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: false
            });
        },
        handleVCard(vaCardData, data) {
            if (Ember.isEmpty(vaCardData)) {
                this.send('showToolTip', data);
            } else {
                this.send('showVCard', vaCardData);
            }
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        },
        triggerSendAction() {
            if (this.get("isNestedChildTable")) {
                this.sendAction("triggerSendAction", ...arguments);
            } else {
                this.send('triggerWBSendAction', ...arguments);
            }
        },
        triggerSearchTable(searchKey) {
            this.get('filters').resetPage();
            this.get('filters').set('searchKey', searchKey);
            this.handleRemoteQueryAction();
        },
        focusInAction(value, record, field) {
            this.sendAction("focusInAction", value, record, field);
        },
        focusOutAction(value, record, field) {
            this.sendAction("focusOutHandler", value, record, field);
        },
        manageColumn(column) {
            let targetColumn = this.get('columns').findBy('field', Ember.get(column, 'field'));
            if (Ember.isEmpty(targetColumn)) {
                return;
            }
            targetColumn.toggleProperty('isHidden');
            let manageColumnItem, iconToolbarItems = this.get('tableToolbarIconToolbarConfig.items');
            if (Ember.isPresent(iconToolbarItems)) {
                if (this.get('isManageColumnAsActionMenu')) {
                    manageColumnItem = iconToolbarItems.filter((item) => {
                        if (Ember.isPresent(item.config.items) && Ember.isPresent(item.config.items.findBy('action', 'manageColumn'))) {
                            return true;
                        }
                    });
                    if (Ember.isPresent(manageColumnItem)) {
                        manageColumnItem = manageColumnItem[0];
                        if (manageColumnItem) {
                            manageColumnItem = Ember.get(manageColumnItem, 'config.items')[0];
                        }
                        this.handleShowHideColumn(Ember.get(manageColumnItem, 'items'));
                    }
                } else {
                    manageColumnItem = iconToolbarItems.find(iconToolbarItem => {
                        let menuItems = iconToolbarItem.get('config.items');
                        return (Ember.isPresent(iconToolbarItem.get('config.triggerElement')) && Ember.isPresent(menuItems));
                    });
                    if (Ember.isPresent(manageColumnItem)) {
                        manageColumnItem = Ember.get(manageColumnItem, 'config.items');
                        this.handleShowHideColumn(manageColumnItem);
                    }
                }
            }
        },
        handleRowAction(content, actionName) {
            console.error('handleRowAction', actionName);
            if (this.get("isNestedChildTable")) {
                this.sendAction("handleRowAction", actionName, content);
            } else {
                this.set(actionName, actionName);
                this.sendAction(actionName, content);
            }
        },
        loadMore() {
            this.incrementProperty('page');
            this.handleRemoteQueryAction();
        },
        sortColumn(column) {
            let target = event.target;
            if (!column.isSortable || Ember.isEmpty(target.className) || target.className.indexOf('global-table__cell_status_sortable') === -1) {
                return;
            }
            this.get('filters').resetPage();
            this.handleSortColumn(column);
        },
        showFilters(column, event) {
            this.set('showFilterOnTop', false);
            this.set('showFilterOnRight', false);

            function closest(el, selector) {
                var matches = el.webkitMatchesSelector ? 'webkitMatchesSelector' : (el.msMatchesSelector ? 'msMatchesSelector' : 'matches');
                while (el.parentElement) {
                    if (el[matches](selector)) { return el; }
                    el = el.parentElement;
                }
                return null;
            }
            let table = this.get('element').querySelector('.global-table__content'),
                position = table.getBoundingClientRect(),
                showFilters = column.get('showFilters'),
                thead = closest(event.target, 'th'),
                theadPosition = thead.getBoundingClientRect();
            this.get('columns').setEach('showFilters', false);
            if (!showFilters) {
                if (position.top > 300 && position.height < 300) {
                    this.set('showFilterOnTop', true);
                }
                if (position.width / 2 < theadPosition.left - position.left) {
                    this.set('showFilterOnRight', true);
                }
                column.set('showFilters', true);
            }
        },
        hideFilters() {
            if (Ember.isPresent(this.get('columns'))) {
                this.get('columns').setEach('showFilters', false);
            }
        },
        addFilter(column) {
            this.get('filters').resetPage();
            this.send('hideFilters', column);
            this.getColumnFilters();
        },
        removeFilter(column) {
            this.send('hideFilters', column);
            if (column.get('filterType') === 'custom') {
                this.resetCustomFilter(column);
            }
            column.setProperties({
                filterValue: null,
                selectedFilter: null
            });
            this.getColumnFilters();
        },
        triggerPrevPage() {
            let pageNumber = this.get('page');
            this.decrementProperty('page');
            this.handleRemoteQueryAction()
                .then()
                .catch(() => this.set('page', pageNumber));
        },
        triggerNextPage() {
            let pageNumber = this.get('page');
            this.incrementProperty('page');
            this.handleRemoteQueryAction()
                .then()
                .catch(() => this.set('page', pageNumber));
        },
        handleRowExpandAction(record, e) {
            Ember.run.next(this, function () {
                if (!this.get('enableMultipleNestedTableRows')) {
                    let openRows = this.get('filteredContent').filterBy('toggledProperty', true);
                    if (Ember.isPresent(openRows)) {
                        Ember.A(openRows).setEach('toggledProperty', false);
                    }
                }
                record.toggleProperty('toggledProperty');
                //On expansion of nested row collapse the child tables
                if (record.get('toggledProperty')) {
                    let nestedRowsField = this.get('nestedRowsConfig.nestedRowsField');
                    if (nestedRowsField && record.get(nestedRowsField)) {
                        record.get(nestedRowsField).setEach('toggledProperty', false);
                    }
                }
                this.send('triggerSendAction', this.get('rowExpandAction'), record, record.get('toggledProperty'));
                e.preventDefault();
            });
        },
        handleNestedRowExpandAction(nestedRows, nestedRow) {
            Ember.A(nestedRows).setEach('toggledProperty', false);
            nestedRow.toggleProperty('toggledProperty');
            this.send('triggerSendAction', this.get('nestedRowsConfig.rowExpandAction'), nestedRow, nestedRow.get('toggledProperty'));
        },
        showSearchBar() {
            this.set('showGlobalTableSearch', true);
        },
        closeSearchBar() {
            this.get('filters').set('searchKey', null);
            this.toggleProperty('showGlobalTableSearch');
        },
        pageSelectionChanged(selection) {
            this.set('pageSize', Ember.get(selection, 'id'));
            if (Ember.isPresent(this.get('filters.pagination.size'))) {
                this.set('filters.pagination.size', this.get('pageSize'));
            }
            this.handleRemoteQueryAction();
        },
        showVCard(data) {
            if (Ember.isPresent(data)) {
                this.mdTooltipManager.open({
                    vCard: data,
                    shownOnOverflow: false
                });
            }
        },
        showMultiLinePopup(content, column) {
            let isRequiredField = Ember.get(column, 'isRequiredField'),
                isRequired = Ember.isPresent(isRequiredField) ? Ember.get(column, isRequiredField) : Ember.get(column, 'isRequired');
            this.mdDialogManager.popup({
                componentName: 'wb-md-table-multiline-popup',
                record: content,
                field: Ember.get(column, 'field'),
                title: Ember.get(column, 'linkText'),
                label: Ember.get(column, 'title'),
                isRequired: isRequired,
                maxLength: Ember.get(column, 'maxLength')
            });
        },
        triggerRowSelection(actionName, record, parentRecord, isChecked) {
            if (this.get("isNestedChildTable")) {
                this.send('triggerSendAction', actionName, record, isChecked, parentRecord);
            } else {
                this.send('triggerSendAction', actionName, record, isChecked);
            }
        }
    }
});