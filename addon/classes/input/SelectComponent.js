import Ember from 'ember';
import MultiLevelSelect from './MultiLevelSelect';

export default Ember.Object.create({
    outSideComponent: '.input-row__inline',
    isSelect: true,
    scrollOffSetY: 0,
    totalRecords: 0,
    enableKeyDownListener: true,
    mousePositionX: 0,
    mousePositionY: 0,
    setFilteredData: Ember.observer('content.[]', function () {
        this.initSelect();
    }),
    onKeyDown(e) {
        let backSpace = e.keyCode === 8,
            value = this.get('searchKey'),
            textLength = value.length,
            selectedItem = this.get('selectedItem'),
            selectedItems = this.get('selectedItems'),
            input = this.get('element').querySelector('input'),
            isOpen = this.get('isOpen'),
            arrow = e.keyCode === 40 || e.keyCode === 38,
            esc = e.keyCode === 27,
            enter = e.keyCode === 13,
            tab = e.keyCode === 9;
        if (!isOpen) {
            return false;
        }
        if (backSpace) {
            if (textLength > 0) {
                this.set('searchKey', value.slice(0, -1));
                Ember.run.next(() => {
                    this.fixSearchInputWidth();
                });
            }
            if (textLength === 0 && selectedItems) {
                selectedItems.popObject();
            }
            if (textLength === 0 && selectedItem) {
                this.set('selectedItem', {});
            }
            e.preventDefault();
        } else if (arrow) {
            this.arrowEvent(e.keyCode);
            e.preventDefault();
        } else if (esc) {
            e.preventDefault();
            this.clickOutside();
        } else if (enter) {
            e.preventDefault();
            this.enterEvent();
        } else if (tab) {
            Ember.tryInvoke(this, 'clickOutside');
        } else if (input) {
            input.focus();
        }
    },
    enterEvent() {
        let filteredContent = this.get('isMemberDropdown') ? this.get('formattedMemberList') : this.get('filteredContent'),
            length = filteredContent.get('length');
        this.send('triggerEnterAction');
        if (length < 1) {
            return;
        }
        let hightLightedItem = filteredContent.findBy('isHighLight', true);
        if (hightLightedItem) {
            this.send('setSelectedItem', hightLightedItem, hightLightedItem.get('isSelected'));
        }
    },
    arrowEvent(keyCode) {
        let down = keyCode === 40,
            filteredContent = this.get('isMemberDropdown') ? this.get('formattedMemberList') : this.get('filteredContent'),
            length = filteredContent.get('length');
        if (length < 1) {
            return;
        }
        let hightLightedItem = filteredContent.findBy('isHighLight', true),
            position = filteredContent.indexOf(hightLightedItem);
        if (down) {
            if (!hightLightedItem) {
                this.getHighLightReadyArray(filteredContent).get('firstObject').set('isHighLight', true);
            } else if (length === position + 1) {
                return;
            } else {
                let nextPosition = position + 1,
                    nextItems = filteredContent.slice(nextPosition, length),
                    nextItem = this.getHighLightReadyArray(nextItems).get('firstObject'),
                    scrollIndex = filteredContent.indexOf(nextItem);
                if (scrollIndex === -1) {
                    return;
                }
                filteredContent.setEach('isHighLight', false);
                filteredContent.objectAt(scrollIndex).set('isHighLight', true);
                this.scrollToHighLight(filteredContent.objectAt(scrollIndex));
            }
        } else {
            if (!hightLightedItem || position === 0) {
                return;
            } else {
                let prevPosition = position,
                    prevItems = filteredContent.slice(0, prevPosition),
                    prevItem = this.getHighLightReadyArray(prevItems).get('lastObject'),
                    scrollIndex = filteredContent.indexOf(prevItem);
                if (scrollIndex === -1) {
                    return;
                }
                filteredContent.setEach('isHighLight', false);
                filteredContent.objectAt(scrollIndex).set('isHighLight', true);
                this.scrollToHighLight(filteredContent.objectAt(scrollIndex));
            }
        }
    },
    getHighLightReadyArray(arr) {
        let filterArray = arr.filter(function (item) {
            return !Ember.get(item, 'isDisabled') && !Ember.get(item, 'isGroupHeader') && !Ember.get(item, 'isReadOnly');
        });
        return Ember.A(filterArray);
    },
    scrollToHighLight(item) {
        let elId = Ember.guidFor(item);
        if (!elId) {
            return;
        }
        let element = document.getElementById(elId),
            dropDown = document.getElementById(`${this.get('elementId')}-dropdown`),
            dropdownHeight = dropDown.getBoundingClientRect().height,
            elementScrollBottom = element.getBoundingClientRect().bottom - dropDown.getBoundingClientRect().top,
            elementScrollTop = dropDown.getBoundingClientRect().top - element.getBoundingClientRect().top;
        if (elementScrollBottom > dropdownHeight) {
            dropDown.scrollTop = dropDown.scrollTop + elementScrollBottom - dropdownHeight;
        }
        if (elementScrollTop > 0) {
            dropDown.scrollTop = dropDown.scrollTop - elementScrollTop;
        }
    },
    initSelect() {
        this.set('filteredContent', Ember.A(this.get('content')));
        if (this.get('multiLevel')) {
            this.reopen(MultiLevelSelect);
            this.initMultiLevelSelect();
        }
        if (Ember.isEmpty(this.get('optionLabelPath'))) {
            this.set('optionLabelPath', 'label');
        }
        if (Ember.isEmpty(this.get('optionValuePath'))) {
            this.set('optionValuePath', 'id');
        }
        if (this.get('multiple')) {
            this.initializeSelectedItems();
        }
        if (!Ember.isEmpty(this.get('value'))) {
            this.set('selectedItem', Ember.A(this.get('content')).findBy(this.get('optionValuePath'), this.get('value')));
        }
        if (!this.get('isReadOnly') && !this.get('isDisabled')) {
            Ember.run.scheduleOnce('afterRender', this, this.hideOverflowItems);
        }
    },
    initializeSelectedItems() {
        if (!Ember.isArray(this.get('selectedItems'))) {
            Ember.assert(`Please pass a Ember Array for the ${this.get('label')} multi select component to hold the selectedItems`);
        } else {
            this.set('selectedItems', Ember.A(this.get('selectedItems')));
            this.get('selectedItems').forEach((selectedItem) => selectedItem = Ember.A(selectedItem));
        }
    },
    handleTriggerDropdown() {
        if (!this.get('multiple') && Ember.isEmpty(this.get('element'))) {
            return;
        }
        if (Ember.isEmpty(this.get('selectedItems')) || this.get('isOpen')) {
            this.set('isCollapsed', false);
            this.set('displayShowHideButton', false);
        }
        if (this.get('isOpen')) {
            this.wbActionHandler('onOpen');
            Ember.run.scheduleOnce('afterRender', this, function () {
                this.setDropdownPosition();
            });
            this.showAllSelectedItems();
            if (this.get('pageable')) {
                this.addScrollListener();
            }
        }
    },
    addScrollListener() {
        Ember.run.scheduleOnce('afterRender', this, function () {
            let scrollElement = document.getElementById(`${this.get('elementId')}-dropdown`),
                startingScroll = scrollElement.scrollTop;
            this.set('scrollOffSetY', startingScroll);
            if (Ember.isPresent(scrollElement)) {
                scrollElement.addEventListener('scroll', this.handleDropDownScroll.bind(this));
                this.set('isScrollListenerAdded', true);
            }
        });
    },
    handleScroll(e) {
        function checkIfScrollTop(prev, now) {
            return (prev > now);
        }

        function checkIfScrollExist(prev, now) {
            return (!Ember.isEmpty(prev) && prev !== now);
        }

        function checkIfElementHideTopPart(elementTop, elementBottom, scrollElementTop, topDirection) {
            return (elementTop < scrollElementTop && elementBottom - scrollElementTop && !topDirection);
        }

        function checkIfElementHideBottomPart(elementBottom, scrollElementBottom, bottomDirection) {
            return (elementBottom > scrollElementBottom && bottomDirection);
        }

        this.setDropdownPosition();
        let target = e.target,
            element = this.get('element'),
            prevScroll = this.get('elementScrollTop'),
            currentsScroll = target.scrollTop,
            scrollDirectionTop = checkIfScrollTop(prevScroll, currentsScroll),
            scrollExist = checkIfScrollExist(prevScroll, currentsScroll),
            elementHideTopPart = checkIfElementHideTopPart(element.getBoundingClientRect().top, element.getBoundingClientRect().bottom, target.getBoundingClientRect().top, scrollDirectionTop),
            elementhideBottomPart = checkIfElementHideBottomPart(element.getBoundingClientRect().bottom, target.getBoundingClientRect().bottom, scrollDirectionTop);
        if (scrollExist && (elementHideTopPart || elementhideBottomPart)) {
            this.clickOutside();
        }
        this.set('elementScrollTop', currentsScroll);
    },
    handleDropDownScroll() {
        let elementScroll = document.getElementById(`${this.get('elementId')}-dropdown`);
        if (elementScroll) {
            let scrollTop = elementScroll.scrollTop,
                scrollHeight = elementScroll.scrollHeight,
                clientHeight = elementScroll.clientHeight,
                heightDelta = scrollHeight - clientHeight,
                previsionScrollTop = this.get('scrollOffSetY');
            if (scrollTop !== previsionScrollTop) {
                if ((scrollTop > previsionScrollTop) && (heightDelta === scrollTop) && this.get('isLoadMoreRecords')) {
                    //scroll down event if scroll up is needed add a else condition i.e scrollTop < previsionScrollTop
                    this.incrementProperty('page');
                    this.handleRemoteQueryAction();
                }
                this.set('scrollOffSetY', scrollTop);
            }
        }
    },
    setDropDownOpenPosition(height, limit, deltaTop) {
        if (Ember.isEmpty(this.get('modalAnimationTop')) || Ember.isEmpty('modalAnimationBottom')) {
            if (height + 15 > limit && deltaTop > 0) {
                this.setProperties({
                    modalAnimationTop: true,
                    modalAnimationBottom: false
                });
            } else {
                this.setProperties({
                    modalAnimationBottom: true,
                    modalAnimationTop: false
                });
            }
        }
    },
    setDropDownMaxHeight(height, limit, deltaTop, bottom, maxHeight) {
        let maxHeightValue = maxHeight;
        if (Ember.isEmpty(this.get('modalAnimationTop')) || Ember.isEmpty('modalAnimationBottom')) {
            if (deltaTop < 0 && height > limit) {
                maxHeightValue = limit - bottom - 10;
            }
        }
        return maxHeightValue;
    },
    getDropDownTopPosition(top, dropDownHeight, elementHeight) {
        let returntop;
        if (this.get('modalAnimationTop')) {
            returntop = top - dropDownHeight - 15;
        }
        if (this.get('modalAnimationBottom')) {
            returntop = top + elementHeight;
        }
        return returntop;
    },
    setDropdownPosition() {
        if (Ember.isEmpty(this.get('element'))) {
            return;
        }
        let element = this.get('element'),
            dropDownReference = element.querySelector('.input-row__element') || element,
            dropDownElement = document.getElementById(`${this.get('elementId')}-dropdown`);
        if (dropDownReference && dropDownElement) {
            let position = dropDownReference.getBoundingClientRect(),
                left = position.left,
                width = position.width,
                dropdownHeight = dropDownElement.clientHeight,
                totalHeight = position.bottom + dropdownHeight,
                deltaTop = position.top - dropdownHeight,
                maxHeight = parseInt(window.getComputedStyle(dropDownElement).maxHeight.replace('px', '')),
                top;
            //first time setup
            maxHeight = this.setDropDownMaxHeight(totalHeight, window.innerHeight, deltaTop, position.bottom, maxHeight);
            this.setDropDownOpenPosition(totalHeight, window.innerHeight, deltaTop);

            //calculate top position
            top = this.getDropDownTopPosition(position.top, dropdownHeight, position.height);
            //set position based on setup
            dropDownElement.style.cssText = `width: ${width}px; left: ${left}px; top: ${top}px; max-height: ${maxHeight}px;`;
        }
    },

    showAllSelectedItems() {
        let selectedSearchItems = this.get('element').querySelectorAll('.input-row__search-item');
        if (Ember.isPresent(selectedSearchItems)) {
            //Since the querySelectorAll will return NodeList not the array we are using Array's forEach method explicitly
            Array.prototype.forEach.call(selectedSearchItems, selectedSearchItem => selectedSearchItem.style.display = 'block');
        }
    },
    didSelectionChanged: Ember.observer('selectedItem', 'selectedItems.[]', function () {
        this.validateDropdown();
        Ember.run.next(() => {
            this.setDropdownPosition();
        });
    }),
    recalculateOverflowItems: function () {

        this.decrementProperty('hiddenItems');

        if (!this.get('isOpen') && !this.get('isCollapsed')) {
            Ember.run.later(this, function () {
                this.showAllSelectedItems();
                this.hideOverflowItems();
            });
        } else {
            return;
        }

    },
    hideOverflowItems() {
        if (!this.get('searchable') || Ember.isEmpty(this.get('element'))) {
            return;
        }
        let searchElement,
            searchElementWidth = 0,
            selectedSearchItems,
            selectedSearchItemsWidth = 75;
        searchElement = this.get('element').querySelector('.input-row__search');
        selectedSearchItems = this.get('element').querySelectorAll('.input-row__search-item');
        if (Ember.isEmpty(searchElement)) {
            return false;
        }
        this.set('hiddenItems', 0);
        searchElementWidth = searchElement.clientWidth;
        if (Ember.isPresent(selectedSearchItems)) {
            //Since the querySelectorAll will return NodeList not the array we are using Array's forEach method explicitly
            Array.prototype.forEach.call(selectedSearchItems, (selectedSearchItem) => {
                selectedSearchItemsWidth += parseInt(selectedSearchItem.clientWidth + 10);
                if (selectedSearchItemsWidth > searchElementWidth) {
                    selectedSearchItem.style.display = 'none';
                    this.incrementProperty('hiddenItems');
                }
            });
        }
        /* return true if drop down is closed and selectedItems width is greater than the drop down width */
        if (selectedSearchItemsWidth > searchElementWidth) {
            this.set('displayShowHideButton', true);
        }
    },
    handleSearch() {
        this.setProperties({
            filteredContent: Ember.A(),
            resolved: false,
            rejected: false,
            page: 1
        });
        let searchKey = this.get('searchKey');
        if (searchKey.length < this.get('minimumInputLength')) {
            return;
        }
        if (this.get('remoteSearch')) {
            this.handleRemoteQueryAction();
        } else {
            this.filterSearch();
        }
    },
    filterSearch() {
        let searchKey = this.get('searchKey'),
            filteredContent = (this.get('multiLevel')) ? this.get('mutantContent') : this.get('content');
        this.set('filteredContent', Ember.A(this.getSearchedContent(filteredContent, searchKey)));
        if (this.get('multiLevel') && Ember.isPresent(this.get('mutantContent'))) {
            this.get('multiLevelfilteredContent').clear();
            let nestedContent = this.get('mutantContent').filter(content => Ember.isPresent(Ember.get(content, 'mutantContent'))),
                multiLevelfilteredContent = Ember.A();
            if (Ember.isPresent(nestedContent)) {
                nestedContent.forEach(content => {
                    multiLevelfilteredContent.addObjects(this.getNestedSearchResult(content, searchKey));
                });
                if (this.get('sortCountriesBy')) {
                    this.get('multiLevelfilteredContent').addObjects(multiLevelfilteredContent.sortBy(this.get('sortCountriesBy')));
                } else {
                    this.get('multiLevelfilteredContent').addObjects(multiLevelfilteredContent);
                }
            }
        }
    },
    getSearchedContent(content, searchKey) {
        if (Ember.isPresent(content)) {
            let filteredContent = content.filter(item => this.isSearchedKeyPresent(item, searchKey));
            return this.get('enableGropuHeader') ? this.filterGroupHeaders(Ember.A(filteredContent)) : filteredContent;
        }
        return Ember.A();
    },
    filterGroupHeaders(filteredContent) {
        return filteredContent.filter((content, index) => {
            if (!Ember.get(content, 'isGroupHeader')) {
                return true;
            }
            let nextContent = filteredContent.objectAt(index + 1);
            return !((Ember.isEqual(filteredContent.get('lastObject'), content)) || (Ember.isPresent(nextContent) && Ember.get(nextContent, 'isGroupHeader')));
        });
    },
    isSearchedKeyPresent(item, searchKey) {
        if (Ember.isEmpty(item) || Ember.isEmpty(item.get(this.get('optionLabelPath')))) {
            return false;
        } else if (Ember.get(item, 'isGroupHeader')) {
            return true;
        }
        if (this.get('enableSearchAcross')) {
            return item.get(this.get('optionLabelPath')).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1;
        }
        return item.get(this.get('optionLabelPath')).toLowerCase().startsWith(searchKey.toLowerCase());
    },
    getNestedSearchResult(content, searchKey) {
        return this.getSearchedContent(Ember.get(content, 'mutantContent'), searchKey);
    },
    handleRemoteQueryAction() {
        let searchAction = this.get('searchAction'),
            queryParams = this.get('searchKey');
        if (Ember.isEmpty(searchAction)) {
            Ember.Logger.error('Please provide searchAction param while invoking the remote search');
        }
        if (this.get('pageable')) {
            queryParams = JSON.stringify({
                page: this.get('page'),
                pageSize: this.get('pageSize'),
                searchKey: this.get('searchKey')
            });
        }
        if (searchAction) {
            this.set('loading', true);
            searchAction(queryParams).then(
                (response) => {
                    this.set('resolved', true);
                    if (this.get('pageable')) {
                        this.set('totalRecords', response.get('meta.totalRecords'));
                        this.get('filteredContent').pushObjects(response.toArray());
                    } else {
                        this.set('filteredContent', response.toArray());
                    }
                },
                (error) => {
                    this.set('rejected', true);
                    Ember.Logger.error(error);
                }
            ).finally(() => {
                this.set('loading', false);
            });
        }
    },
    /**
     * On user input the fixSearchInputWidth method is invoked to calculate the width of HTML input
     * @method input
     * @param {event} The event object emitted from the element
     * @return {}. this method does not return any value
     */
    input() {
        this.fixSearchInputWidth();
        return true;
    },
    /**
     * To calculate and set the width of the input, we have a hidden div with class .input-row__search-hidden which will hold
     * all the selected items and searchKey value
     * @method click
     * @param {} The moethod does not take any params
     * @return {} this method does not return any value
     */
    fixSearchInputWidth() {
        if (Ember.isEmpty(this.get('element'))) {
            return;
        }
        let searchInputHidden = this.get('element').querySelector('.input-row__search-hidden'),
            searchInput = this.get('element').querySelector('input'),
            searchKeyLength = this.get('searchKey').length;
        if (Ember.isPresent(searchInputHidden) && Ember.isPresent(searchInput) && searchKeyLength > 0) {
            searchInput.style.width = `${Math.ceil(searchInputHidden.clientWidth) + 2}px`;
        } else {
            searchInput.removeAttribute('style');
        }
    },
    validateDropdown() {
        let errorMessage = null,
            value = this.get('multiple') ? this.get('selectedItems') : this.get('selectedItem');
        errorMessage = this.validateInput(value);
        this.set('componentErrorMessage', errorMessage);
    },
    isRecordExist(record) {
        let optionValuePath = this.get('optionValuePath'),
            selectedItems = this.get('selectedItems');
        return selectedItems.isAny(optionValuePath, Ember.get(record, optionValuePath));
    },
    clickOutside() {
        Ember.run.later(() => {
            if (this.get('isOpen') && !this.get('isDestroying')) {
                this.validateDropdown();
                if (!this.get('isTableInput')) {
                    this.focusOut();
                }
                this.hideOverflowItems();
                this.setProperties({
                    isOpen: false,
                    isActive: false,
                    modalAnimationTop: null,
                    modalAnimationBottom: null,
                    elementScrollTop: null
                });
                if (this.get('filteredContent').length) {
                    this.get('filteredContent').setEach('isHighLight', false);
                }
                if (this.get('searchable')) {
                    this.send('clearSearchKey');
                }
            }
        });
    },
    didRender() {
        //reposition on rerender
        if (!this.get('isDestroying')) {
            Ember.tryInvoke(this, 'checkForHelpTextOverflow');
            if (this.get('isOpen')) {
                this.setDropdownPosition();
            }
        }
    },
    resetState() {
        if (this.get('remoteSearch')) {
            this.setProperties({
                resolved: false,
                rejected: false
            });
        }
        this.set('filteredContent', Ember.A((this.get('multiLevel')) ? this.get('mutantContent') : this.get('content')));
    },
    handleMultiSelection(record) {
        if (Ember.isEmpty(record)) {
            return;
        }
        if (this.isRecordExist(record)) {
            this.send('removeSelectedItem', record);
        } else {
            this.get('selectedItems').addObject(record);
            this.set('didSelectionChange', Ember.uuid());
            this.sendAction('onChange', record, true, this.get('elementId'), event);
        }
        if (this.get('isMaxSelectionReached')) {
            this.clickOutside();
        }
    },
    handleSingleSelection(record = Ember.Object.create(), isSelected = true) {
        if (Ember.isEmpty(record)) {
            isSelected = false;
        }
        this.setProperties({
            selectedItem: (isSelected) ? record : {},
            value: (isSelected) ? Ember.get(record, this.get('optionValuePath')) : ''
        });
        this.clickOutside();
        this.sendAction('onChange', record, isSelected, this.get('elementId'), event);
    },
    searchKeyObserver: Ember.observer('searchKey', function () {
        let searchKey = this.get('searchKey');
        if (searchKey.length >= this.get('minimumInputLength')) {
            Ember.run.debounce(this, this.handleSearch, this.get('debounceTime'));
        }
        this.fixSearchInputWidth();
    }),
    actions: {
        triggerTableSelectAllAction() {
            this.send('triggerWBSendAction', this.get('selectAllAction'), ...arguments);
        },
        triggerTableResultAction() {
            this.sendAction('onChange', ...arguments);
        },
        clearSearchKey() {
            Ember.run.later(this, function () {
                this.set('searchKey', '');
                if (this.get('multiLevel')) {
                    this.handleSearch();
                }
                this.resetState();
            }, 300);
        },
        removeSelectedItem(record) {
            this.set('didSelectionChange', Ember.uuid());
            if (this.get('multiLevel')) {
                this.send('toggleSelectedItem', record);
            } else {
                this.get('selectedItems').removeObject(record);
                this.recalculateOverflowItems();
                this.sendAction('onChange', record, false, this.get('elementId'), event);
            }
        },
        setSelectedItem(record, isSelected) {
            if (this.get('multiple')) {
                this.handleMultiSelection(record);
            } else {
                this.handleSingleSelection(record, isSelected);
            }
            this.set('searchKey', '');
            this.validateDropdown();
        },
        toggleSelectView() {
            if (this.get('isCollapsed')) {
                this.hideOverflowItems();
            } else {
                this.showAllSelectedItems();
            }
            this.toggleProperty('isCollapsed');
        },
        triggerDropdown() {
            if ((event.target && event.target.className === 'input-row__search-toggle') || this.get('isMaxSelectionReached')) {
                return false;
            }
            if (!this.get('isOpen')) {
                Ember.run.next(this, () => {
                    this.set('isOpen', true);
                    this.set('elementScrollTop', null);
                    this.handleTriggerDropdown();
                });
            }
            if (this.get('searchable')) {
                this.handleClickEvent(event, 'input');
            }
        },
        triggerHeaderAction() {
            this.clickOutside();
            Ember.run.next(this, function () {
                this.send('triggerWBSendAction', this.get('headerAction'));
            });
        },
        memberDropDownRowAction() {
            this.clickOutside();
            let arg = arguments;
            Ember.run.next(this, function () {
                this.set(arg[0], arg[0]);
                this.sendAction(arg[0], arg[1]);
            });
        },
        setDropItemHighLight(item, event) {
            if (Ember.isEmpty(event)) {
                return;
            }
            let content = this.get('filteredContent'),
                eventX = event.clientX,
                eventY = event.clientY,
                prevX = this.get('mousePositionX'),
                prevY = this.get('mousePositionY');
            if (eventX === prevX || eventY === prevY) {
                return;
            }
            this.setProperties({
                mousePositionX: eventX,
                mousePositionY: eventY
            });
            if (!Ember.get(item, 'isHighLight')) {
                content.setEach('isHighLight', false);
                Ember.set(item, 'isHighLight', true);
            }
        },
        unSetDropItemHighLight(item) {
            Ember.set(item, 'isHighLight', false);
        }
    }
});