import Ember from 'ember';

export default Ember.Object.create({
    dynamicUpdate: Ember.observer('selectedChildValues.[]', function () {
        this.updateSelectedState();
    }),
    onKeyDown(e) {
        let backSpace = e.keyCode === 8,
            value = this.get('searchKey'),
            textLength = value.length,
            selectedItems = this.get('selectedItems'),
            input = this.get('element').querySelector('input'),
            isOpen = this.get('isOpen');
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
            if (textLength === 0 && Ember.isPresent(selectedItems)) {
                let lastItem = selectedItems[selectedItems.length - 1];
                if (lastItem) {
                    this.handleToggleSelection(lastItem);
                }
            }
            e.preventDefault();
        } else {
            input.focus();
        }
    },

    initMultiLevelSelect() {
        this.initializeMultiLevelSelectVariables();
        this.mutateContent();
        if (Ember.isPresent(this.get('selectedChildValues'))) {
            this.updateSelectedState();
        }
    },
    setupMultiSelect() {
        if (!this.get('multiSelect')) {
            return;
        }
        this.updateSelectedState();
        let value = this.get('value'),
            content = this.get('content');
        if (Ember.get(value, 'length') > 0) {
            value.forEach(item => {
                let preSelectedItem = content.findBy('item.id', Ember.get(item, 'id'));

                if (Ember.isPresent(preSelectedItem) && preSelectedItem.get('content') &&
                    preSelectedItem.get('content.length') === value.length) {
                    preSelectedItem.set('isSelected', true);
                    this.get('selectedItems').addObject(preSelectedItem);
                }
            });
        }
    },
    didIsHiddenChanged: Ember.observer('content.@each.isHidden', function () {
        this.get('mutantContent').forEach((mutatedContent, index) => {
            let sourceContent = this.get('content').objectAt(index);
            if (Ember.isPresent(sourceContent)) {
                mutatedContent.set('isHidden', sourceContent.get('isHidden'));
            }
        });
    }),
    didMultiLevelContentHiddenChanged() {
        this.get('content').forEach((multiLevelContent, index) => {
            let mutantContent = this.get('mutantContent').objectAt(index);
            if (Ember.isPresent(mutantContent)) {
                mutantContent.set('isHidden', multiLevelContent.get('isHidden'));
            }
        });
    },
    mutateContent() {
        if (Ember.isEmpty(this.get('content'))) {
            return;
        }
        this.get('mutantContent').clear();
        this.get('multiLevelContent').clear();
        this.get('multiLevelfilteredContent').clear();
        let optionValuePath = this.get('optionValuePath'),
            multiLevelfilteredContent = Ember.A(),
            mutantContent = this.get('content').map(content => {
                let nestedContents = Ember.get(content, 'content');
                content.addObserver('content.@each.isHidden', content, this.didMultiLevelContentHiddenChanged);
                if (Ember.isPresent(nestedContents)) {
                    content.set('mutantContent', nestedContents.map(nestedContent => {
                        return Ember.assign(Ember.Object.create(), nestedContent);
                    }));
                    Ember.A(content.get('mutantContent')).setEach('parentId', content.get(optionValuePath));
                    multiLevelfilteredContent.addObjects(content.get('mutantContent'));
                    this.setSelectedState(content.get('mutantContent'));
                    this.get('multiLevelContent').addObjects(content.get('mutantContent'));
                }
                return Ember.assign(Ember.Object.create(), content);
            });
        if (this.get('sortCountriesBy')) {
            this.get('multiLevelfilteredContent').addObjects(multiLevelfilteredContent.sortBy(this.get('sortCountriesBy')));
        } else {
            this.get('multiLevelfilteredContent').addObjects(multiLevelfilteredContent);
        }
        this.get('mutantContent').addObjects(mutantContent);
        this.set('filteredContent', mutantContent);
        this.setSelectedState(this.get('mutantContent'));
    },
    setCheckboxState() {
        this.get('mutantContent').map(content => {
            this.setSelectedState(content.get('mutantContent'));
        });
        this.setSelectedState(this.get('mutantContent'));
    },
    setSelectedState(items) {
        let selectedItems = this.get('isStandAlone') ? this.get('selectedItems') : this.get('value'),
            optionValuePath = this.get('optionValuePath');
        if (Ember.isPresent(selectedItems) && selectedItems.get('length') > 0) {
            selectedItems.forEach(selectedItem => {
                let matchedItem = Ember.A(items).findBy(optionValuePath, selectedItem.get(optionValuePath));
                if (Ember.isPresent(matchedItem)) {
                    matchedItem.set('isChecked', true);
                }
            });
        } else if (Ember.isPresent(items)) {
            items.setEach('isChecked', false);
        }
    },
    initializeMultiLevelSelectVariables() {
        this.defineComputedProperty('mutantContent', 'array');
        this.defineComputedProperty('multiLevelContent', 'array');
        this.defineComputedProperty('multiLevelfilteredContent', 'array');
    },
    didMutantContentChanged: Ember.observer('mutantContent.@each.isChecked', function () {
        Ember.run.next(this, function () {
            let filteredContent = this.get('mutantContent'),
                checkedItems = filteredContent.filterBy('isChecked', true),
                optionValuePath = this.get('optionValuePath'),
                uncheckedItems = filteredContent.filterBy('isChecked', false);
            if (Ember.isPresent(checkedItems)) {
                checkedItems.forEach(checkedItem => {
                    checkedItem.set('isIndeterminate', false);
                    if (Ember.isPresent(checkedItem.get('mutantContent'))) {
                        Ember.A(checkedItem.get('mutantContent').filter((item) => !item.get('isHidden'))).setEach('isChecked', true);
                        this.removeuncheckedItems(checkedItem.get('mutantContent'));
                    }
                    if (!this.get('selectedItems').isAny(optionValuePath, Ember.get(checkedItem, optionValuePath))) {
                        this.get('selectedItems').addObject(checkedItem);
                    }
                });
            }
            if (Ember.isPresent(uncheckedItems)) {
                uncheckedItems.forEach(unCheckedItem => {
                    if (Ember.isPresent(unCheckedItem.get('mutantContent'))) {
                        if (!unCheckedItem.get('isIndeterminate')) {
                            unCheckedItem.get('mutantContent').setEach('isChecked', false);
                        }
                    }
                    this.removeuncheckedItems(unCheckedItem);
                });
            }
        });
    }),
    removeuncheckedItems(items) {
        if (Ember.typeOf(items) === 'array') {
            items.forEach(item => {
                this.findAndRemoveObject(this.get('selectedItems'), item, this.get('optionValuePath'));
            });
        } else {
            this.findAndRemoveObject(this.get('selectedItems'), items, this.get('optionValuePath'));
        }
    },
    findAndRemoveObject(source, target, key) {
        let selectedItem = source.findBy(key, target.get(key));
        if (Ember.isPresent(selectedItem)) {
            source.removeObject(selectedItem);
        }
    },
    updateParentStatusWhenChildStateChange(parentId, childs) {
        let childCount = childs.filter((item) => !item.get('isHidden')).length;
        let selectedChildCount = childs.filter((item) => !item.get('isHidden'))
            .filter((item) => item.get('isChecked')).length;
        let unselectedChildCount = childs.filter((item) => !item.get('isHidden'))
            .filter((item) => !item.get('isChecked')).length;
        if (selectedChildCount || unselectedChildCount) {
            let parent = this.get('mutantContent').findBy(this.get('optionValuePath'), parentId);
            parent.setProperties({
                isChecked: selectedChildCount === childCount,
                isIndeterminate: (selectedChildCount && unselectedChildCount)
            });
            selectedChildCount === childCount ? this.addParentAndRemoveChilds(parentId, childs) : this.removeParentAndAddChilds(parentId, childs);
        }
    },
    getParentChildMap(checkedItems, uncheckedItems) {
        let parentAndChildMapList = Ember.A();

        function setMap(mapList, selectedChild, unSelectedChilds) {
            let map = mapList.findBy('parentId', Ember.get(selectedChild, 'parentId'));
            if (map) {
                map.childs.addObject(selectedChild);
            } else {
                map = { parentId: Ember.get(selectedChild, 'parentId'), childs: Ember.A() };
                map.childs.addObject(selectedChild);
                mapList.addObject(map);
            }
            if (unSelectedChilds) {
                map.childs.addObjects(unSelectedChilds);
            }
        }
        checkedItems.forEach((child) => {
            let uncheckedChilds = uncheckedItems.filter((item) => item.get('parentId') === Ember.get(child, 'parentId'));
            setMap(parentAndChildMapList, child, uncheckedChilds);
        });

        uncheckedItems.forEach((child) => {
            setMap(parentAndChildMapList, child);
        });
        return parentAndChildMapList;
    },
    updateSelectedState() {
        let selectedChildValues = this.get('selectedChildValues');
        let parentValuePath = this.get('parentValuePath') || 'parentId';

        if (Ember.isEmpty(selectedChildValues)) {
            this.get('multiLevelContent').filter((item) => item.get('isChecked')).forEach((child) => {
                let parent = this.get('mutantContent').findBy(this.get('optionValuePath'), child.get(parentValuePath));
                parent.setProperties({
                    isChecked: false,
                    isIndeterminate: false
                });
                child.set('isChecked', false);
            });
            this.get('selectedItems').clear();
            return;
        }

        this.get('mutantContent').forEach((parent) => {
            if (parent.mutantContent && parent.mutantContent.length) {
                let matchedChilds = selectedChildValues.filter((child) => {
                    let result = false;
                    if (child[parentValuePath] === parent.get(this.get('optionValuePath'))) {
                        child.parentId = child[parentValuePath];
                        result = true;
                    }
                    return result;
                });
                this.updateSelection(parent, matchedChilds);
            }
        });
    },
    updateSelection(parent, selctedChilds) {
        let optionValuePath = this.get('optionValuePath'),
            mutantContent = parent.get('mutantContent'),
            selectedchildItems = mutantContent.filter((child) => {
                let isPresent = Ember.A(selctedChilds).findBy(optionValuePath, child.get(optionValuePath));
                return !!isPresent;
            }),
            nonSelectedItems = mutantContent.filter((child) => {
                let isPresent = Ember.A(selctedChilds).findBy(optionValuePath, child.get(optionValuePath));
                return !isPresent;
            });
        selectedchildItems.setEach('isChecked', true);
        nonSelectedItems.setEach('isChecked', false);
        this.getParentChildMap(selectedchildItems, nonSelectedItems).forEach((map) => {
            this.updateParentStatusWhenChildStateChange(map.parentId, map.childs);
        });
        this.removeuncheckedItems(nonSelectedItems);
    },
    addParentAndRemoveChilds(parentId, childs) {
        let optionValuePath = this.get('optionValuePath');
        let parent = this.get('mutantContent').findBy(optionValuePath, parentId);
        if (!this.get('selectedItems').isAny(optionValuePath, parentId)) {
            this.get('selectedItems').addObject(parent);
        }
        this.get('selectedItems').removeObjects(childs);
    },
    removeParentAndAddChilds(parentId, childs) {
        let optionValuePath = this.get('optionValuePath');
        let parent = this.get('mutantContent').findBy(optionValuePath, parentId);
        this.findAndRemoveObject(this.get('selectedItems'), parent, optionValuePath);
        childs.forEach(item => {
            if (item.get('isChecked')) {
                if (!this.get('selectedItems').isAny(optionValuePath, Ember.get(item, optionValuePath))) {
                    this.get('selectedItems').addObject(item);
                }
            } else {
                this.findAndRemoveObject(this.get('selectedItems'), item, optionValuePath);
            }

        });
    },
    getHiddenChildElementsCount(parentId) {
        let hiddenElementsCount = 0,
            hiddenElements = Ember.A(this.get('multiLevelContent')).filterBy('parentId', parentId);
        if (Ember.isPresent(hiddenElements)) {
            //add hidden elemnts to the child count
            hiddenElementsCount = Ember.get(Ember.A(hiddenElements).filterBy('isHidden', true), 'length');
        }
        return hiddenElementsCount;
    },
    onChildToggleUpdateParent(record) {
        if (!record.get('content')) {
            let parentId = Ember.get(record, 'parentId'),
                childs;
            let optionValuePath = this.get('optionValuePath');
            this.get('mutantContent').filter((item) => {
                if (item.get(optionValuePath) === parentId) {
                    childs = item.get('mutantContent');
                }
            });
            this.updateParentStatusWhenChildStateChange(parentId, childs);
        }
    },
    handleToggleSelection(record) {
        if (Ember.isEmpty(record) || this.get('selectedItems.length') >= this.get('maxSelection')) {
            return;
        }
        let target = event.target;
        if (Ember.isPresent(target) && Ember.isPresent(target.className) && target.className.indexOf('input-checkbox__icon') !== -1) {
            return;
        }
        record.toggleProperty('isChecked');
        this.onChildToggleUpdateParent(record);
        this.sendAction('onChange', record, record.get('isChecked'), this.get('elementId'), event);
    },
    actions: {
        toggleSelectedItem(record) {
            this.handleToggleSelection(record);
        }
    }
});