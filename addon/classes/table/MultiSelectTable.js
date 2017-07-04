import Ember from 'ember';

export default Ember.Object.create({
    initMultiSelect() {
        let checkBoxMenuAction = this.get('checkboxSelectionMenu.action');
        if (Ember.isPresent(checkBoxMenuAction)) {
            this.set(checkBoxMenuAction, checkBoxMenuAction);
        }
        this.set('selectAllPage', 'selectAllPage');
    },
    didSelectionChanged: Ember.observer('filteredContent.@each.isChecked', 'selectedIds.@each.isChecked', function () {
        this.determineCheckboxState();
        this.setSelectionCount();
    }),
    didSelectedItemsChanged: Ember.observer('selectionCount', function () {
        this.determineCheckboxState();
    }),
    determineCheckboxState() {
        if (!this.get('isMultiSelect')) {
            return;
        }
        let selectedItems = this.get('selectedItems'),
            unCheckItems = this.get('selectedIds').filterBy('isChecked', false);
        if (!this.get('isDropdownInput')) {
            this.get('selectedItems').clear();
        }
        if (Ember.isPresent(selectedItems) && Ember.isPresent(unCheckItems)) {
            unCheckItems.forEach(item => {
                selectedItems.removeObject(selectedItems.find((uncheckedItem) => {
                    return Ember.isEqual(uncheckedItem.get(this.get('uniqueColumn')), item.id);
                }));
            });
        }
        if (this.get('enableModelSelection')) {
            let selectedItems = this.get('filteredContent').filterBy(this.get('isChecked'), true);
            this.get('selectedItems').addObjects(selectedItems);
            this.setCheckboxState(this.get('selectionCount'), this.get('filteredContent.length'));
            return;
        } else {
            let filteredContent = this.get('filteredContent'),
                uniqueColumn = this.get('uniqueColumn'),
                selectedIds = this.get('selectedIds').filterBy('isChecked', true);
            let selectedItems = selectedIds.map((item) => {
                return filteredContent.findBy(uniqueColumn, Ember.get(item, 'id'));
            });
            this.get('selectedItems').addObjects(selectedItems);
            this.setCheckboxState(this.get('selectionCount'), this.get('filteredContent.length'));
        }
    },
    setupMultiSelectContent() {
        let content = this.get('content'),
            uniqueColumn = this.get('uniqueColumn'),
            selectedItems = this.get('selectedItems');
        if (!Ember.isArray(selectedItems)) {
            Ember.assert('Please pass a Ember Array for the multi select table to hold the selectedItems');
        }
        if (this.get('enableModelSelection')) {
            let isChecked = this.get('isChecked'),
                isDisabled = this.get('isDisabled');
            this.get('filteredContent').forEach(item => {
                if (Ember.isEmpty(Ember.get(item, isChecked))) {
                    Ember.set(item, isChecked, false);
                }
                if (Ember.isEmpty(Ember.get(item, isDisabled))) {
                    Ember.set(item, isDisabled, false);
                }
            });
        }
        selectedItems.addObjects(selectedItems);
        this.get('selectedIds').clear();
        let selectedIds = content.map((row) => {
            let isChecked = Ember.isPresent(this.get('selectedItems').findBy(uniqueColumn, row.get(uniqueColumn)));
            return Ember.Object.create({ isChecked: isChecked, id: row.get(uniqueColumn) });
        });
        this.get('selectedIds').addObjects(selectedIds);
        this.setSelectionCount();
        this.determineCheckboxState();
    },
    setSelectionCount() {
        let selectionCount = 0;
        if (this.get('enableModelSelection')) {
            selectionCount = Ember.get(this.get('filteredContent').filterBy(this.get('isChecked'), true), 'length');
        } else {
            selectionCount = Ember.get(this.get('selectedIds').filterBy('isChecked', true), 'length');
        }
        this.set('selectionCount', selectionCount);
    },
    setCheckboxState(selectedItemsCount, filteredContentCount) {
        if (selectedItemsCount === filteredContentCount) {
            this.set('isIndeterminate', false);
            this.set('isAllRecordSelected', true);
        } else if (selectedItemsCount > 0) {
            this.set('isIndeterminate', true);
            this.set('isAllRecordSelected', false);
        } else {
            this.set('isIndeterminate', false);
            this.set('isAllRecordSelected', false);
        }
    },
    selectAllRecords() {
        if (this.get('enableModelSelection')) {
            let filteredContent = this.getActiveRecords();
            Ember.A(filteredContent).forEach((item) => {
                let disableSelectFieldValue = this.get('disableSelectField');
                if (disableSelectFieldValue) {
                    if (!item.get(disableSelectFieldValue)) {
                        item.set('isChecked', true);
                    }
                } else {
                    item.set('isChecked', true);
                }
            });
        } else {
            Ember.A(this.getActiveSelectedIds()).setEach('isChecked', true);
        }
    },
    getActiveSelectedIds() {
        return this.get('selectedIds').filter(item => {
            let record = this.get('filteredContent').findBy(this.get('uniqueColumn'), item.get('id'));
            return (Ember.isPresent(record) && !Ember.get(record, this.get('disableSelectField')));
        });
    },
    getActiveRecords() {
        if (this.get('enableModelSelection')) {
            return this.get('filteredContent').filter(content => {
                return !content.get(this.get('disableSelectField'));
            });
        } else {
            let activeSelectedIds = this.getActiveSelectedIds();
            return this.get('filteredContent').filter(content => {
                let selectedId = Ember.A(activeSelectedIds).findBy('id', Ember.get(content, this.get('uniqueColumn')));
                return Ember.isPresent(selectedId);
            });
        }

    },
    deselectAllRecords() {
        if (this.get('enableModelSelection')) {
            let filteredContent = this.getActiveRecords();
            Ember.A(filteredContent).setEach(this.get('isChecked'), false);
        } else {
            Ember.A(this.getActiveSelectedIds()).setEach('isChecked', false);
        }
    },
    handleSelectAllRecords(isChecked) {
        let isAllRecordSelected = this.getIsAllRecordSelected();
        if (isChecked && !isAllRecordSelected) {
            this.selectAllRecords();
        } else {
            this.deselectAllRecords();
        }
    },

    getIsAllRecordSelected() {
        let enabledRowsCount = this.getActiveRecords();
        if (this.get('selectionCount') === Ember.get(enabledRowsCount, 'length') && this.get('selectionCount') > 0) {
            return true;
        } else {
            return false;
        }
    },
    actions: {
        handleSelectAllToggle() {
            this.handleSelectAllRecords(this.get('isAllRecordSelected'));
            if (Ember.isPresent(this.get('selectAllAction'))) {
                Ember.run.next(this, function () {
                    let parameters = [this.get('selectAllAction'), this.get('isAllRecordSelected'), this.get('selectedItems'), this.get('isIndeterminate')];
                    if (this.get("isNestedChildTable")) {
                        parameters.push(this.get('parentRecord'));
                    } else {
                        parameters.push(event);
                    }
                    this.send('triggerSendAction', ...parameters);
                });
            }
        },
        onSelectAll() {
            Ember.Logger.log('On Select All');
        },
        onSelectView() {
            Ember.Logger.log('On Select View');
        }
    }
});