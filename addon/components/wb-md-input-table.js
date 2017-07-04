import Ember from 'ember';
import layout from '../templates/components/wb-md-input-table';
import ComponentHelper from '../mixins/component-helper';
import clickOutside from '../mixins/click-outside';
import DateComponent from '../classes/input/DateComponent';
import InputComponent from '../classes/input/InputComponent';
import SelectComponent from '../classes/input/SelectComponent';
import scrollListener from '../mixins/scroll-listener';
import keyBoardEvents from '../mixins/key-board-events';

export default Ember.Component.extend(ComponentHelper, clickOutside, scrollListener, keyBoardEvents, {
    layout,
    classNameBindings: [
        'isOpen:input-table_status_open',
        'isDisabled:input-table_status_disabled',
        'hasErrors',
        'isBorderedInput'
    ],
    isOpen: false,
    clearSelectedItemsOnContentChange: false,
    isSelect: false,
    minimumInputLength: 3,
    debounceTime: 500,
    optionLabelPath: 'label',
    disableResetSelection: false,
    optionValuePath: Ember.computed('optionValuePathConfig', {
        get() {
            return Ember.isPresent(this.get('optionValuePathConfig')) ? this.get('optionValuePathConfig') : 'id';
        }
    }),
    type: 'text',
    value: '',
    isTableInput: true,
    multiSelect: false,
    modalPosition: null,
    maxSelection: 0,
    resolved: false,
    rejected: false,
    loading: false,
    enableScrollListener: true,
    clearSelectedItems: Ember.observer('items', 'items.[]', 'clearSelectedItemsOnContentChange', function () {
        let clearSelectedItemsOnContentChange = this.get('clearSelectedItemsOnContentChange');
        if (clearSelectedItemsOnContentChange) {
            this.get('selectedItems').clear();
        }
        return;
    }),
    content: Ember.computed(function () { return Ember.A(); }),
    filteredContent: Ember.computed(function () { return this.get('content'); }),
    isNonSelectRemoteSearch: Ember.computed('isSearchable', 'isSelect', function () {
        return this.get('isSearchable') && !this.get('isSelect');
    }),
    isRemoteSearch: Ember.computed.bool('isNonSelectRemoteSearch'),
    loadingMessage: 'Loading...',
    noMatchesMessage: Ember.computed('resolved', function () {
        if (this.get('resolved') && Ember.isEmpty(this.get('filteredContent'))) {
            return 'No data available';
        }
        return;
    }),
    emptyContentMessage: Ember.computed('tableEmptyContentMessage', {
        get() {
            if (this.get('enableRemoteSearch')) {
                return this.get('searchMessage');
            }
            return Ember.isPresent(this.get('tableEmptyContentMessage')) ? this.get('tableEmptyContentMessage') : 'No data available';
        }
    }),
    searchFailedMessage: Ember.computed('rejected', function () {
        if (this.get('rejected')) {
            return 'Error retrieving data';
        }
        return;
    }),
    enableRemoteSearch: false,
    remoteSearch: Ember.computed.alias('enableRemoteSearch'),
    searchMessage: Ember.computed('minimumInputLength', 'remoteSearchMessage', function () {
        return Ember.isPresent(this.get('remoteSearchMessage')) ? this.get('remoteSearchMessage') : `Type minimum ${this.get('minimumInputLength')} to search`;
    }),
    enableKeyDownListener: true,
    hasErrors: Ember.computed('fieldErrors.length', function () {
        if (this.get('fieldErrors.length') > 0) {
            return (this.get('isBordered')) ? 'input-table-numeric_status_error' : 'input-table_status_error';
        }
        return false;
    }),
    isBorderedInput: Ember.computed('isBordered', function () {
        return this.get('isBordered') ? 'input-table-numeric' : 'input-table';
    }),
    selectedItem: Ember.computed('value', function () {
        if (this.get('multiSelect')) {
            return;
        }
        let value = this.get('value');
        if (this.get('isSearchable') && Ember.isPresent(value)) {
            this.set('searchText', Ember.get(value, this.get('optionLabelPath')));
            if (this.get('isNonSelectRemoteSearch')) {
                this.get('content').clear();
            }
        }
        return value;
    }),
    isMaxSelectionReached: Ember.computed('maxSelection', 'selectedItems.@each', function () {
        if (this.get('maxSelection') === 0) {
            return false;
        }
        let isMaxSelectionReached = (this.get('multiSelect') && this.get('selectedItems.length') >= this.get('maxSelection'));
        this.toggleDisableStatus(isMaxSelectionReached);
        return isMaxSelectionReached;
    }),
    selectedItems: Ember.computed(function () {
        return Ember.A();
    }),
    tempModal: null,
    selectedItemsLabel: Ember.computed('content.@each.isSelected', 'value', 'value.@each', function () {
        if (this.get('isMultiLevelSelect') && Ember.isPresent(this.get('value'))) {
            return Ember.A(this.get('value')).mapBy(this.get('optionLabelPath')).join(', ');
        }
        let selectedItems = Ember.A(this.get('content')).filterBy('isSelected', true);
        if (Ember.get(selectedItems, 'length') > 0) {
            this.get('value').addObjects(this.get('selectedItems').mapBy('item'));
            return Ember.A(selectedItems).mapBy(`item.${this.get('optionLabelPath')}`).join(', ');
        }
        return this.get('placeholder');
    }),
    didContentChanged: Ember.computed('items.@each', function () {
        if (this.get('isSelect') || this.get('isSearchable')) {
            this.setUpSelect();
        }
        if (this.get('isNonSelectRemoteSearch') && this.get('isOpen')) {
            this.set('loading', false);
            Ember.run.next(this, this.setDropdownPosition);
        }
        return this.get('items.length');
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        if (this.get('isMultiLevelSelect')) {
            this.setUpSelect();
            Ember.defineProperty(this, 'selectedItems', Ember.computed.alias('value'));
        }
        this.initializeInputComponent();
        this.initializeObservers();
        this.setupSelectDefaults();
    },
    initializeInputComponent() {
        let type = this.get('type');
        if (type === 'date') {
            this.reopen(DateComponent);
            this.set('isInputRow', false);
            Ember.defineProperty(this, 'isActive', Ember.computed.alias('isOpen'));
            this.initDate();
        } else if (this.get('isMultiLevelSelect')) {
            this.reopen(SelectComponent);
            this.set('multiLevel', true);
            this.initSelect();
        } else if (type === 'number') {
            this.reopen(InputComponent);
            this.initInput();
        }
    },
    setUpSelect() {
        this.setupSelectDefaults();
        this.copyContentArray();
        this.setupMultiSelect();
    },
    setupSelectDefaults() {
        if (Ember.isEmpty(this.get('optionLabelPath'))) {
            this.set('optionLabelPath', 'label');
        }
        if (Ember.isEmpty(this.get('optionValuePath'))) {
            this.set('optionValuePath', 'id');
        }
    },
    copyContentArray() {
        let items = this.get('items'),
            value = this.get('value');
        if (this.get('isMultiLevelSelect')) {
            this.set('content', this.get('items'));
        } else if (Ember.isPresent(items)) {
            let optionValuePath = this.get('optionValuePath'),
                selectedId = '';
            if (Ember.isPresent(value) && !this.get('multiSelect')) {
                selectedId = Ember.get(value, optionValuePath);
            }
            let copiedItems = this.wrapContentArray(items, selectedId);
            this.get('content').clear();
            this.get('content').addObjects(Ember.A(copiedItems));
        }
    },
    wrapContentArray(objectArray, selectedId) {
        let optionValuePath = this.get('optionValuePath');
        if (Ember.isEmpty(objectArray)) {
            return [];
        }
        return objectArray.map(item => {
            if (Ember.isPresent(Ember.get(item, 'content'))) {
                item.set('items', this.wrapContentArray(Ember.get(item, 'content'), optionValuePath, selectedId));
            }
            return Ember.Object.create({
                item: item,
                isSelected: (Ember.get(item, optionValuePath) === selectedId)
            });
        });
    },
    setupMultiSelect() {
        if (!this.get('multiSelect')) {
            return;
        }
        let value = this.get('value'),
            content = this.get('content');
        if (Ember.isEmpty(this.get('maxSelection'))) {
            this.set('maxSelection', 0);
        }
        if (Ember.get(value, 'length') > 0) {
            value.forEach(item => {
                let preSelectedItem = content.findBy('item.id', Ember.get(item, 'id'));
                if (Ember.isPresent(preSelectedItem)) {
                    preSelectedItem.set('isSelected', true);
                    this.get('selectedItems').addObject(preSelectedItem);
                }
            });
        }
    },
    toggleDisableStatus(isMaxSelectionReached) {
        let content = (isMaxSelectionReached) ? this.get('content').filterBy('isSelected', false) : this.get('content').filterBy('isDisabled', true);
        if (Ember.isEmpty(content)) {
            return;
        }
        Ember.A(content).setEach('isDisabled', isMaxSelectionReached);
    },
    /* Add change observer to subMenus - Need rewrite to N deep */
    initializeObservers() {
        let items = this.get('items');
        if (Ember.isEmpty(items)) {
            return;
        }
        items.forEach((item) => {
            if (item.hasOwnProperty('items')) {
                this.set('multiSelect', true);
                if (Ember.A(item.get('items')).isAny('isSelected', true)) {
                    item.set('indeterminate', true);
                }
                item.addObserver('items.@each.isSelected', item, this.subMenuObserver);
            }
        });
    },
    label: Ember.computed('selectedItem', function () {
        if (!this.get('isSelect') || Ember.isEmpty(this.get('selectedItem'))) {
            return this.get('placeholder');
        }
        Ember.run.next(this, 'handleMultipleSelection');
        let label = Ember.get(this.get('selectedItem'), this.get('optionLabelPath'));
        return (Ember.isEmpty(label)) ? this.get('placeholder') : label;
    }),
    // When implemention app sets the value programtically, seletecd items is not reset correctly
    // the following method is a hack to overcome the behaviour
    handleMultipleSelection() {
        let label = Ember.get(this.get('selectedItem'), this.get('optionLabelPath')),
            optionLabelPath = this.get('optionLabelPath'),
            selectedItemFromContent = Ember.A(this.get('content')).findBy('isSelected', true);
        if (Ember.isPresent(selectedItemFromContent)) {
            let selectedItemFromContentLabel = selectedItemFromContent.get(`item.${optionLabelPath}`);
            if (Ember.isEqual(selectedItemFromContentLabel, label)) {
                return;
            }
            this.get('content').forEach(content => {
                if (!Ember.isEqual(content.get(`item.${optionLabelPath}`), label)) {
                    content.set('isSelected', false);
                }
            });
        }
    },
    /* Sub menu observer */
    subMenuObserver(item) {
        let childSelectedItems = Ember.A(item.get('items')).filterBy('isSelected', true),
            subItemsLength = Ember.get(item, 'items.length'),
            childSelectedItemsLength = Ember.get(childSelectedItems, 'length');
        if (subItemsLength === childSelectedItemsLength) {
            item.set('indeterminate', false);
            item.set('isSelected', true);
        } else if (childSelectedItemsLength === 0) {
            item.set('isSelected', false);
            item.set('indeterminate', false);
        } else {
            item.set('isSelected', false);
            item.set('indeterminate', true);
        }
    },
    didRender() {
        if (this.get('isOpen') && this.get('isSelect') || this.get('isSearchable') || this.get('type') === 'date') {
            this.setDropdownPosition();
        }
    },
    setDropdownPosition() {
        let element = this.get('element'),
            dropDownReference = element.querySelector('.input-table__inline') || element,
            dropDownElement = document.getElementById(`${this.get('elementId')}-dropdown`);
        if (dropDownReference && dropDownElement) {
            let position = dropDownReference.getBoundingClientRect(),
                left = position.left,
                width = position.width,
                dropdownHeight = dropDownElement.clientHeight,
                dropdownWidth = dropDownElement.clientWidth,
                totalHeight = position.bottom + dropdownHeight,
                top;
            //first time setup
            if (Ember.isEmpty(this.get('modalAnimationTop')) || Ember.isEmpty('modalAnimationBottom')) {
                if (totalHeight > window.innerHeight) {
                    this.set('modalAnimationTop', true);
                } else {
                    this.set('modalAnimationBottom', true);
                }
            }
            if (left + dropdownWidth > window.innerWidth) {
                left = window.innerWidth - dropdownWidth;
            }
            //set position based on setup
            if (this.get('modalAnimationTop')) {
                top = position.top - dropdownHeight;
            }
            if (this.get('modalAnimationBottom')) {
                top = position.top + position.height;
            }

            dropDownElement.style.cssText = `min-width: ${width}px; left: ${left}px; top: ${top}px;`;
        }
    },
    handleScroll(e) {
        let target = e.target,
            element = this.get('element');
        if (element.getBoundingClientRect().top < target.getBoundingClientRect().top) {
            this.clickOutside();
        }
        this.setDropdownPosition();

    },
    subItemPosition(el) {
        var modalPosition = 0,
            docPosition;
        if (el.srcElement.parentNode.querySelector(".input-table__modal")) {
            let item = el.srcElement.parentNode.querySelector(".input-table__modal");
            docPosition = document.body.getBoundingClientRect();
            modalPosition = item.getBoundingClientRect();
            if (Math.round(docPosition.left + docPosition.width) < Math.round(modalPosition.left + modalPosition.width)) {
                item.classList.add('input-table__modal_sub-position_left');
            }
            if (modalPosition.bottom > docPosition.bottom) {
                let h = docPosition.bottom - modalPosition.bottom - 28;
                item.style.cssText = `top: ${h}px;`;
            }
        }
    },
    clickOutside() {
        this._super(...arguments);
        this.handleClickOutside();
    },
    handleClickOutside() {
        this.set('isOpen', false);
        this.set('modalAnimationTop', null);
        this.set('modalAnimationBottom', null);
        if (this.get('isSearchable')) {
            Ember.run.next(this, this.resetSearchState);
        }
    },
    resetSearchState() {
        if (this.get('isDestroying') || this.get('isDestroyed')) {
            return;
        }
        if (this.get('isNonSelectRemoteSearch') && !this.get('enableRemoteSearch')) {
            this.get('content').clear();
        }
        if (Ember.isEmpty(this.get('value')) || Ember.get(this.get('value'), this.get('optionLabelPath')) !== this.get('searchText')) {
            this.set('searchText', '');
        }
        if (this.get('isSearchable') && !this.get('isNonSelectRemoteSearch') && !this.get('enableRemoteSearch')) {
            this.set('filteredContent', this.get('content'));
            if (Ember.isPresent(this.get('value')) && Ember.isEmpty(this.get('searchText'))) {
                this.set('value', {});
                if (Ember.isPresent(this.get('filteredContent'))) {
                    Ember.A(this.get('filteredContent')).setEach('isSelected', false);
                }
            }
        }
    },
    onModalOpen: Ember.observer("isOpen", function () {
        if (this.get('isOpen')) {
            Ember.tryInvoke(this, 'onOpen');
        } else {
            Ember.tryInvoke(this, 'onClose');
        }
    }),
    handleSearch() {
        let searchText = this.get('searchText');
        if (this.get('isNonSelectRemoteSearch')) {
            this.set('loading', true);
            Ember.tryInvoke(this, 'searchAction', [searchText]);
        } else if (this.get('enableRemoteSearch')) {
            this.handleRemoteSearchedContent(this.get('content'), searchText);
        } else {
            this.set('filteredContent', this.getSearchedContent(this.get('content'), searchText));
            Ember.run.next(this, this.setDropdownPosition);
        }
        this.set('isOpen', true);
    },
    getSearchedContent(content, searchKey) {
        if (Ember.isPresent(content)) {
            return content.filter(record => this.isSearchedKeyPresent(record.get('item'), searchKey));
        }
        return [];
    },
    handleRemoteSearchedContent(content, searchKey) {
        this.setProperties({
            resolved: false,
            rejected: false
        });
        let matchedItems = content.filter(record => this.isSearchedKeyPresent(record.get('item'), searchKey)),
            matchedItemsLength = Ember.get(matchedItems, 'length'),
            enableRemoteSearch = this.get('enableRemoteSearch'),
            searchKeyLength = Ember.get(searchKey, 'length'),
            minimumInputLength = this.get('minimumInputLength');
        if ((matchedItemsLength === 0) && enableRemoteSearch && (searchKeyLength >= minimumInputLength)) {
            this.handleRemoteSearch(matchedItems, searchKey);
        } else {
            this.set('filteredContent', matchedItems);
            Ember.run.next(this, this.setDropdownPosition);
        }
    },
    handleRemoteSearch(matchedItems, searchKey) {
        let filteredContent = [];
        let searchAction = this.get('remoteSearchAction');
        if (Ember.isPresent(searchAction) && Ember.typeOf(searchAction) === 'function') {
            this.set('loading', true);
            searchAction(searchKey, this.get('columnName'), this.get('filteredItem')).then(response => {
                    let responseArray = response.toArray();
                    filteredContent = this.wrapContentArray(responseArray);
                    this.set('resolved', true);
                    this.set('filteredContent', filteredContent);
                    Ember.run.next(this, this.setDropdownPosition);
                })
                .catch(() => this.set('rejected', true))
                .finally(() => this.set('loading', false));
        }
    },
    isSearchedKeyPresent(item, searchKey) {
        if (Ember.isEmpty(item) || Ember.isEmpty(item.get(this.get('optionLabelPath')))) {
            return false;
        }
        if (this.get('enableSearchAcross')) {
            return item.get(this.get('optionLabelPath')).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1;
        }
        return item.get(this.get('optionLabelPath')).toLowerCase().startsWith(searchKey.toLowerCase());
    },
    resetSelectedItems() {
        this.get('items').forEach(item => {
            Ember.A(item.get('items')).setEach('isSelected', false);
        });
    },
    //on enter
    onKeyDown(e) {
        let enter = e.keyCode === 13,
            isOpen = this.get('isOpen');
        if (!isOpen) {
            return false;
        }
        if (enter) {
            e.preventDefault();
            this.enterEvent();
        }
    },
    enterEvent() {
        let searchText = this.get('searchText');
        Ember.tryInvoke(this, 'enterAction', [searchText]);
    },
    actions: {
        showToolTip() {
            let data = '';
            if (this.get('isSelect')) {
                data = (this.get('multiSelect')) ? this.get('selectedItemsLabel') : this.get('label');
            } else if (this.get('isSearchable')) {
                data = this.get('searchText');
            } else if (this.get('isFormatted')) {
                data = this.get('formattedValue');
            } else if (this.get('type') === 'date') {
                data = this.get('dateValue');
            } else {
                data = this.get('value');
            }
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: true
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        },
        validateTableInput(valueName) {
            let value = this.get(valueName);
            if (Ember.isPresent(value) && this.get('isNegative') && value.toString().lastIndexOf('-') > 0) {
                let i = 0;
                this.set(valueName, value.replace(/-/g, function (match) {
                    return ++i >= 1 ? "" : match;
                }));
            }
            if (this.get('type') === 'number') {
                this.validateInputValue(this.get(valueName), valueName);
            }
        },
        toggleSelectItem(clickItem) {
            Ember.set(clickItem, "isSelected", !Ember.get(clickItem, "isSelected"));
            if (Ember.get(clickItem, 'items')) {

            }
            if (clickItem.hasOwnProperty('items')) {
                let isSelect = Ember.get(clickItem, "isSelected");
                Ember.get(clickItem, 'items').forEach(item => {
                    Ember.set(item, 'isSelected', isSelect);
                });
            }
            //if multiSelect is false, set siblings items isSelected to false
            if (!this.get('multiSelect')) {
                let itemsArray = this.get('items');
                for (let item of itemsArray) {
                    if (item !== clickItem) {
                        Ember.set(item, "isSelected", false);
                    }
                }
                this.clickOutside();
            }
        },
        setNestedSelectedItem(record, parentRecord) {
            let isSelected = Ember.get(record, 'isSelected');
            this.resetSelectedItems();
            Ember.set(record, 'isSelected', isSelected);
            this.send('setSelectedItem', record, parentRecord);
        },
        setSelectedItems(record) {
            record.toggleProperty('isSelected');
            this.get('value').clear();
            if (record.get('isSelected')) {
                this.get('selectedItems').addObject(record);
            } else {
                this.get('selectedItems').removeObject(record);
            }
            Ember.run.next(this, function () { Ember.tryInvoke(this, 'onChange', [record.get('item'), record.get('isSelected')]); });
        },
        setSelectedItem(record, parentRecord) {
            let isSelected = Ember.get(record, 'isSelected'),
                actionArguments = Ember.A([record.get('item'), !isSelected]);
            if (this.get('disableResetSelection') && isSelected) {
                this.clickOutside();
                return;
            }
            if (!this.get('isNonSelectRemoteSearch')) {
                Ember.A(this.get('content')).setEach('isSelected', false);
            }
            Ember.set(record, 'isSelected', !isSelected);
            if (isSelected) {
                this.set('value', {});
            } else {
                this.set('value', Ember.get(record, 'item'));
            }
            if (Ember.isPresent(parentRecord)) {
                actionArguments.pushObject(parentRecord);
            }
            Ember.run.next(this, function () { Ember.tryInvoke(this, 'onChange', actionArguments); });
            this.clickOutside();
        },
        addSubMenus(item) {
            Ember.set(item, "showSubmenu", true);
            this.set('tempModal', true);
            var el = event;
            Ember.run.next(this, function () {
                this.subItemPosition(el);
            });
        },
        removeSubMenus(item) {
            this.set('tempModal', false);
            item.set("showSubmenu", false);
        },
        triggerSearch() {
            if (this.get('isNonSelectRemoteSearch')) {
                this.set('isOpen', false);
            }
            this.send('validateTableInput', 'searchText');
            if (!this.get('isNonSelectRemoteSearch') || this.get('searchText.length') >= this.get('minimumInputLength')) {
                Ember.run.debounce(this, this.handleSearch, this.get('debounceTime'));
            }
        },
        clickEvent() {
            if (this.get('isSelect') || this.get('type') === 'date') {
                this.set('isOpen', true);
            }
        },
        onFocusIn() {
            Ember.tryInvoke(this, 'onFocusIn');
        },
        onFocusOut() {
            Ember.tryInvoke(this, 'onFocusOut');
        }
    }
});