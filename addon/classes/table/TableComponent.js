import Ember from 'ember';

export default Ember.Object.create({
    handleScroll(e) {
        if (this.get('loading') || !this.get('isLoadMoreRecords')) {
            return;
        }
        let pageScroll = e.target.scrollTop,
            scrollHeight = e.target.scrollHeight,
            elementHeight = e.target.clientHeight;
        //Trigger before reaching the end of page
        pageScroll += 50;
        if ((scrollHeight - pageScroll <= elementHeight) && this.get('isLoadMoreRecords')) {
            this.incrementProperty('page');
            this.handleRemoteQueryAction();
        }
    },
    initHeaderToolbar() {
        if (Ember.isEmpty(this.get('headerToolBar'))) {
            return;
        }
        if (!this.get('headerToolBar.disableTableSearch')) {
            this.get('tableToolbarIconToolbarConfig.items').pushObject(Ember.Object.create({
                componentName: 'wb-md-icon',
                config: {
                    iconName: 'search',
                    action: 'showSearchBar',
                    helpText: this.get('headerToolBar.tableSearchTooltip')
                }
            }));
        }
        if (!this.get('headerToolBar.disableTableDownload')) {
            this.get('tableToolbarIconToolbarConfig.items').pushObject(Ember.Object.create({
                componentName: 'wb-md-icon',
                config: {
                    iconName: 'get_app',
                    isDisabled: this.get('headerToolBar.isDownloadDisabled'),
                    action: this.get('headerToolBar.downloadAction'),
                    helpText: this.get('headerToolBar.downloadTooltip')
                }
            }));
        }
        if (this.get('headerToolBar.customActionMenuConfig')) {
            let menuItems = this.get('headerToolBar.customActionMenuConfig.items');
            //change the given action to tables acion and assign a custom action for all menu items
            this.setUpCustomActionMenuActions(menuItems);
            this.set('headerToolBar.customActionMenuConfig.action', 'handleRowAction');
            this.get('tableToolbarIconToolbarConfig.items').pushObject(Ember.Object.create({
                componentName: 'wb-md-action-menu',
                config: this.get('headerToolBar.customActionMenuConfig')
            }));
        }
        if (this.get('headerToolBar.enableShowHideColumn')) {
            let columns = Ember.A(this.get('columns')),
                columnActions;
            if (Ember.isPresent(columns)) {
                columns = columns.filterBy('showAlways', false || undefined);
            }
            columnActions = columns.map((column) => {
                return Ember.Object.create({
                    label: Ember.get(column, 'title'),
                    field: Ember.get(column, 'field'),
                    action: "manageColumn",
                    isToggleSelection: this.get('isManageColumnAsActionMenu') ? undefined : true,
                    isDisabled: Ember.get(column, 'isDisabled'),
                    isSelected: (!Ember.get(column, 'isHidden'))
                });
            });
            if (this.get('isManageColumnAsActionMenu')) {
                this.setManageColumnUnderActionMenu(columnActions);
            } else {
                this.setManageColumnAsActionMenu(columnActions);
            }
        }
        if (Ember.isEmpty(this.get('headerToolBar.items'))) {
            this.set('headerToolBar.items', Ember.A());
        }
        this.get('headerToolBar.items').forEach(item => this.get('tableToolbarIconToolbarConfig.items').push(Ember.Object.create({ config: item })));
        this.registerActions();
    },
    setUpCustomActionMenuActions(items) {
        if (Ember.isEmpty(items)) {
            return;
        }
        items.forEach(item => {
            let childItems = Ember.get(item, 'items');
            if (Ember.isPresent(childItems)) {
                this.setUpCustomActionMenuActions(childItems);
            }
            item.setProperties({
                menuAction: Ember.get(item, 'action'),
                action: 'handleCustomMenuAction'
            });
        });
    },
    setManageColumnUnderActionMenu(columnActions) {
        this.get('tableToolbarIconToolbarConfig.items').pushObject(Ember.Object.create({
            config: {
                items: Ember.A([
                    Ember.Object.create({
                        label: "Manage Columns",
                        action: "manageColumn",
                        type: "parent",
                        isNotTrigger: true,
                        iconName: "view_column",
                        items: Ember.A(columnActions)
                    })
                ])
            }
        }));
    },
    setManageColumnAsActionMenu(columnActions) {
        this.get('tableToolbarIconToolbarConfig').set('actionMenuConfig',
            Ember.Object.create({
                closeOnClickOutside: true,
                triggerElement: Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: Ember.Object.create({
                        iconName: 'view_column',
                        helpText: 'Manage Columns'
                    })
                })

            })
        );
        this.get('tableToolbarIconToolbarConfig.items').pushObject(Ember.Object.create({
            config: {
                items: Ember.A(columnActions),
                triggerElement: Ember.Object.create({
                    componentName: 'wb-md-icon',
                    config: Ember.Object.create({
                        iconName: 'view_column'
                    })
                })
            }
        }));
    },
    removeSearchAction(actionsArray) {
        let showSearchBarAction = actionsArray.findBy('action', 'showSearchBar');
        if (Ember.isPresent(showSearchBarAction)) {
            actionsArray.removeObject(showSearchBarAction);
        }
    },
    registerActions() {
        let items = this.get('tableToolbarIconToolbarConfig.items'),
            actionsArray = Ember.A();
        items.forEach(item => {
            let items = item.get('items');
            if (items) {
                items.forEach(item => {
                    let action = item.get('config.action');
                    if (action) {
                        actionsArray.pushObject(item.get('config'));
                    }
                });
            } else {
                let action = item.get('config.action');
                if (action) {
                    actionsArray.pushObject(item.get('config'));
                }
            }
        });
        this.removeSearchAction(actionsArray);
        //Remove dublicated actions
        actionsArray = [...new Set(actionsArray)];
        actionsArray.forEach(item => {
            let action = Ember.get(item, 'action'),
                //register Actions on component for proxy it upper
                func = new Function("return function " + action + "(item){ this.send('triggerSendAction', (Ember.isPresent(Ember.get(item,'config.action'))) ? Ember.get(item,'config.action') : Ember.get(item, 'action'), item); }")(item);
            this.get('actions')[action] = func;
        });
    },
    initColumns() {
        let columns = this.get('columns'),
            hasFilters = (this.get('sortable') && this.get('filterable'));
        if (Ember.isEmpty(columns)) {
            return;
        }
        //@Deprecation
        columns.forEach((column) => {
            if (Ember.get(column, 'type') === 'numeric') {
                Ember.Logger.error('The column type numeric is deprecated please use type as number and isBordered true');
                Ember.set(column, 'type', 'number');
                Ember.set(column, 'isBordered', true);
            }
        });
        Ember.merge(this.get('filters'), Ember.Object.create());
        if (Object.keys(this.get('filters')).length === 0 || Ember.isEmpty(this.get('filters.pagination')) || this.get('isNestedChildTable')) {
            this.get('filters').setProperties({
                searchKey: '',
                pagination: Ember.Object.create({ page: 1, size: this.get('defaultPageSize') }),
                filters: Ember.A(),
                sort: {}
            });
        }
        if (hasFilters) {
            this.initializeFilters();
        }
        if (this.get('headerToolBar.enableShowHideColumn') || hasFilters) {
            let visibleColumns;
            columns = columns.map((column) => {
                let newColumn = Ember.Object.create(column),
                    isColumnDisabled;
                newColumn.setProperties({
                    isSorted: Ember.isEmpty(Ember.get(column, 'isSorted')) ? false : Ember.get(column, 'isSorted'),
                    isFiltered: Ember.isEmpty(Ember.get(column, 'isFiltered')) ? false : Ember.get(column, 'isFiltered'),
                    isSortable: Ember.isEmpty(Ember.get(column, 'isSortable')) ? true : Ember.get(column, 'isSortable'),
                    isFilterable: Ember.isEmpty(Ember.get(column, 'isFilterable')) ? true : Ember.get(column, 'isFilterable'),
                    showFilters: Ember.isEmpty(Ember.get(column, 'showFilters')) ? false : Ember.get(column, 'showFilters'),
                    isSortedAsc: Ember.isEmpty(Ember.get(column, 'isSortedAsc')) ? false : Ember.get(column, 'isSortedAsc'),
                    isHidden: Ember.isEmpty(Ember.get(column, 'isHidden')) ? false : Ember.get(column, 'isHidden')
                });
                if (Ember.isPresent(Ember.get(column, 'isDisabled'))) {
                    isColumnDisabled = Ember.get(column, 'isDisabled');
                } else {
                    isColumnDisabled = Ember.isEmpty(Ember.get(column, 'isHidden')) ? false : Ember.get(column, 'isHidden');
                }
                newColumn.set('isDisabled', isColumnDisabled);
                if (this.get('filterable')) {
                    this.defineColumnComputedProperty(newColumn);
                }
                return newColumn;
            });
            visibleColumns = Ember.A(columns).filterBy('isHidden', false);
            if (Ember.isPresent(visibleColumns)) {
                if (Ember.get(visibleColumns, 'length') > this.get('displayColumnCount')) {
                    visibleColumns.forEach((column, index) => {
                        if (++index > this.get('displayColumnCount')) {
                            Ember.set(column, 'isHidden', true);
                            Ember.set(column, 'isDisabled', true);
                        }
                    });
                }
            }
        }
        Ember.merge(this.get('columns'), Ember.A(columns));
        if (this.get('isNestedChildTable') && hasFilters) {
            this.get('columns').forEach(column => this.resetAllFilters(column));
        }
    },
    defineColumnComputedProperty(newColumn) {
        let isApplyButtonEnabled;
        if (newColumn.get('filterType') === 'custom') {
            //compute the isApplyButtonEnabled on intial load
            let filterValuePath = newColumn.get('filterConfig.filterValuePath');
            isApplyButtonEnabled = !newColumn.get('filterConfig.items').any(item => Ember.isPresent(item.get(filterValuePath)));
            // since the filter items and filterValue is path is dynamic add observer for each item so that the isApplyButtonEnabled can be recalculted on change
            newColumn.get('filterConfig.items')
                .forEach(filterItem => filterItem.addObserver(newColumn.get('filterConfig.filterValuePath'), newColumn, this.didCustomFilterItemChanged));
        } else {
            isApplyButtonEnabled = Ember.isEmpty(newColumn.get('selectedFilter')) || Ember.isEmpty(newColumn.get('filterValue'));
            newColumn.addObserver('selectedFilter', newColumn, this.didColumnFilterItemChanged);
            newColumn.addObserver('filterValue', newColumn, this.didColumnFilterItemChanged);
        }
        newColumn.set('isApplyButtonEnabled', isApplyButtonEnabled);
    },
    didColumnFilterItemChanged() {
        let isApplyButtonEnabled = Ember.isEmpty(this.get('selectedFilter')) || Ember.isEmpty(this.get('filterValue'));
        this.set('isApplyButtonEnabled', isApplyButtonEnabled);
    },
    didCustomFilterItemChanged() {
        let filterValuePath = this.get('filterConfig.filterValuePath'),
            isAnyItemsFilled = this.get('filterConfig.items').any(item => Ember.isPresent(item.get(filterValuePath)));
        this.set('isApplyButtonEnabled', !isAnyItemsFilled);
    },
    initializeFilters() {
        let filters = this.get('filters');
        filters.setProperties({
            triggerFilterChange: 0,
            resetParam: '',
            resetPage() {
                this.get('pagination').set('page', 1);
            },
            resetFilters() {
                Ember.A(this.get('filters')).clear();
                this.set('resetParam', 'filter');
                this.incrementProperty('triggerFilterChange');
            },
            resetSort() {
                this.setProperties({
                    sort: {},
                    resetParam: 'sort'
                });
                this.incrementProperty('triggerFilterChange');
            },
            resetAll() {
                this.resetPage();
                this.resetFilters();
                this.resetSort();
                this.set('resetParam', 'all');
            }
        });
    },
    didFiltersChanged: Ember.observer('filters.triggerFilterChange', function () {
        if (this.get('filters.triggerFilterChange') > 0) {
            Ember.run.debounce(this, this.handleFilterChanged, 500);
        }
    }),
    handleFilterChanged() {
        if (this.get('filters.resetParam') === 'sort') {
            this.resetSort();
        } else if (Ember.isPresent(this.get('columns'))) {
            this.get('columns').forEach(column => {
                if (this.get('filters.resetParam') === 'all') {
                    this.resetAllFilters(column);
                } else if (this.get('filters.resetParam') === 'filter') {
                    this.resetFilters(column);
                }
            });
        }
        if (!this.get('filters.disableQueryAction')) {
            this.getColumnFilters();
        }
        if (this.get('filters.resetParam') === 'all' && this.get('filters.resetManageColumns')) {
            this.resetManageColumns();
        }
    },
    resetAllFilters(column) {
        if (Ember.isPresent(column.get('filterConfig.content'))) {
            Ember.A(column.get('filterConfig.content')).setEach('isSelected', false);
        }
        if (column.get('filterType') === 'custom') {
            this.resetCustomFilter(column);
        }
        column.setProperties({
            selectedFilter: {},
            filterValue: '',
            isFiltered: false,
            isSorted: false,
            isSortedAsc: false
        });
    },
    resetManageColumns() {
        let actionMenuItems, manageColumnItem, iconToolbarItems = this.get('tableToolbarIconToolbarConfig.items');
        if (Ember.isPresent(iconToolbarItems)) {
            manageColumnItem = iconToolbarItems.filter((item) => {
                if (Ember.isPresent(item.config.items) && Ember.isPresent(item.config.items.findBy('action', 'manageColumn'))) {
                    return true;
                }
            });
            if (Ember.isPresent(manageColumnItem)) {
                manageColumnItem = manageColumnItem[0];
                if (Ember.isPresent(manageColumnItem) && this.get('isManageColumnAsActionMenu')) {
                    manageColumnItem = Ember.get(manageColumnItem, 'config.items')[0];
                    actionMenuItems = Ember.get(manageColumnItem, 'items');
                } else if (Ember.isPresent(manageColumnItem)) {
                    actionMenuItems = Ember.get(manageColumnItem, 'config.items');
                }
            }
        }
        if (Ember.isPresent(actionMenuItems)) {
            this.get('columns').forEach(column => {
                let actionMenuItem = actionMenuItems.findBy('field', column.get('field'));
                if (Ember.isPresent(actionMenuItem)) {
                    actionMenuItem.set('isSelected', !column.get('isHidden'));
                }
            });
            this.handleShowHideColumn(actionMenuItems);
        }
    },
    resetCustomFilter(column) {
        let filterValuePath = Ember.get(column, 'filterConfig.filterValuePath');
        if (Ember.isPresent(column.get('filterConfig.items'))) {
            Ember.A(column.get('filterConfig.items')).setEach(filterValuePath, '');
        }
    },
    handleResetSort(sourceColumn, targetColumn) {
        if (Ember.isEqual(sourceColumn, targetColumn)) {
            return;
        }
        targetColumn.setProperties({
            isSortedAsc: false,
            isSorted: false
        });
    },
    resetSort() {
        if (Ember.isPresent(this.get('filters.sort')) && Object.keys(this.get('filters.sort')).length > 0) {
            let sortedColumnName = this.get('filters.sort.column'),
                sortedColumn = Ember.A(this.get('columns')).findBy('field', sortedColumnName);
            if (Ember.isPresent(sortedColumn)) {
                sortedColumn.setProperties({
                    isSorted: false,
                    isSortedAsc: false
                });
            }
        }
    },
    resetFilters(column) {
        column.setProperties({
            selectedFilter: {},
            filterValue: '',
            isFiltered: false
        });
    },
    handleShowHideColumn(items) {
        let columns = this.get('columns'),
            visibleColumns = Ember.A(columns.filterBy('isHidden', false));
        if (Ember.get(visibleColumns, 'length') <= this.get('minColumnCount')) {
            let uncheckedColumns = Ember.A(columns.filterBy('isHidden', true));
            uncheckedColumns.setEach('isDisabled', false);
            visibleColumns.setEach('isDisabled', true);
        } else if ((Ember.get(visibleColumns, 'length') < this.get('displayColumnCount'))) {
            columns.setEach('isDisabled', false);
        } else {
            let uncheckedColumns = Ember.A(columns.filterBy('isHidden', true));
            uncheckedColumns.setEach('isDisabled', true);
        }
        if (Ember.isPresent(items)) {
            items.forEach(item => this.updateColumnMenuState(item));
        }
    },
    updateColumnMenuState(menuItem) {
        let column = this.get('columns').findBy('field', Ember.get(menuItem, 'field'));
        if (Ember.isPresent(column)) {
            Ember.set(menuItem, 'isDisabled', Ember.get(column, 'isDisabled'));
        }
    },

    handleResponse(response) {
        if (this.get('pageType') === 'default' || (this.get('page') === 1)) {
            this.set('content', response);
            this.initFilteredContent();
        } else if (Ember.typeOf(response) === 'instance') {
            this.get('filteredContent').addObjects(response.toArray());
        } else if (Ember.typeOf(response) === 'array') {
            this.get('filteredContent').addObjects(response);
        }
        if (Ember.isEmpty(response)) {
            this.set('lastPage', true);
        } else if (this.get('isLoadMoreRecords')) {
            this.set('lastPage', false);
        }
    },
    handleRemoteQueryAction() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            let filters = this.get('filters'),
                nestedChildTableFlag = this.get("isNestedChildTable");
            this.resetRemoteAPIParams();
            this.set('loading', true);
            if (Ember.isEmpty(this.get('queryAction'))) {
                Ember.Logger.error('Please provide a closure action "queryAction" for invoking the remote API request');
            }
            //Invoke the closure action specified for the remote invocation
            this.get('queryAction')(JSON.stringify(filters), nestedChildTableFlag, this.get('parentRecord'))
                .then(
                    response => {
                        this.set('resolved', true);
                        resolve();
                        this.handleResponse(response);
                    },
                    error => {
                        reject();
                        this.set('rejected', true);
                        Ember.Logger.error(error);
                    })
                .finally(() => this.set('loading', false));
        });
    },
    handleSortColumn(column) {
        let filters = this.get('filters');
        this.get('columns').forEach(targetColumn => this.handleResetSort(column, targetColumn));
        if (column.get('isSorted')) {
            if (column.get('isSortedAsc')) {
                column.toggleProperty('isSortedAsc');
            } else {
                column.toggleProperty('isSorted');
            }
        } else {
            column.toggleProperty('isSorted');
            column.toggleProperty('isSortedAsc');
        }
        filters.setProperties({
            sort: {
                column: Ember.get(column, 'field'),
                isAsc: Ember.get(column, 'isSortedAsc')
            }
        });
        if (!column.get('isSorted')) {
            filters.set('sort', {});
        }
        this.handleRemoteQueryAction();
    },
    getColumnFilters() {
        let columns = this.get('columns'),
            filters = this.get('filters'),
            columnFilters;
        if (Ember.isEmpty(columns)) {
            return;
        }
        columnFilters = columns.filter(column => this.hasFilter(column)).map(column => this.mapFilter(column));
        filters.set('filters', columnFilters);
        this.handleRemoteQueryAction();
    },
    hasFilter(column) {
        if (column.get('filterType') === 'dropdown') {
            return !Ember.isEmpty(column.get('filterValue'));
        } else if (column.get('filterType') === 'custom') {
            let filterValuePath = column.get('filterConfig.filterValuePath');
            return Ember.A(column.get('filterConfig.items')).every(item => Ember.isPresent(Ember.get(item, filterValuePath)));
        }
        return !Ember.isEmpty(column.get('filterValue')) && !Ember.isEmpty(column.get('selectedFilter.id'));
    },
    mapFilter(column) {
        let filterValue = (column.get('filterType') === 'custom') ? column.get('filterConfig.items') : column.get('filterValue'),
            filterValuePath = Ember.isPresent(column.get('filterConfig.filterValuePath')) ? column.get('filterConfig.filterValuePath') : this.get('filterValuePath'),
            filter = Ember.Object.create({
                filterType: column.get('filterType'),
                column: column.get('field'),
                condition: column.get('selectedFilter.id')
            });
        filter.set(filterValuePath, filterValue);
        return filter;
    },
    resetRemoteAPIParams() {
        this.set('resolved', false);
        this.set('rejected', false);
    },
    actions: {
        handleCustomMenuAction(menuItem) {
            this.send('triggerSendAction', Ember.get(menuItem, 'menuAction'), menuItem);
        },
        handleDropdownFilter(filterItem, column) {
            this.get('filters').resetPage();
            let isMultiSelect = Ember.get(column, 'filterConfig.isMultiselect'),
                filterContent = Ember.get(column, 'filterConfig.content'),
                isSelected = !Ember.get(filterItem, 'isSelected');
            if (!isMultiSelect && Ember.isPresent(filterContent)) {
                Ember.A(filterContent).setEach('isSelected', false);
            }
            Ember.set(filterItem, 'isSelected', isSelected);
            column.set('filterValue', Ember.A(filterContent).filterBy('isSelected', true));
            this.send('hideFilters', column);
            this.getColumnFilters();
        }
    }
});