import Ember from 'ember';
import layout from '../templates/components/wb-md-table-cell-list';
import ClickOutside from '../mixins/click-outside';
import scrollListener from '../mixins/scroll-listener';

export default Ember.Component.extend(ClickOutside, scrollListener, {
    layout,
    tagName: 'td',
    showMoreList: false,
    enableScrollListener: true,
    classNames: ['global-table__cell', 'global-table__cell_type_data'],
    classNameBindings: ['isPriorityWidthColumn:global-table__cell_status_priority',
        'isShowMoreList:global-table__cell_status_more',
        'isAlignTop:global-table__cell_align_top',
        'isAlignRight:global-table__cell_align_right',
        'isDisabled:global-table__text_status_disabled'
    ],
    isPriorityWidthColumn: Ember.computed('column.isPriorityWidth', function () {
        return this.get('column.isPriorityWidth');
    }),
    isAlignTop: Ember.computed('column.verticalAlignment', function () {
        return this.get('column.verticalAlignment') === 'top';
    }),
    isAlignRight: Ember.computed('column.horizontalAlignment', function () {
        return this.get('column.horizontalAlignment') === 'right';
    }),
    displayShowListIcon: Ember.computed('hiddenItemsCount', function () {
        return this.get('hiddenItemsCount') > 0;
    }),
    hiddenItemsCount: Ember.computed('filteredItem.{column.field}.[]', function () {

        let filteredItem = this.get('filteredItem').get(this.get('column.field'));
        if (Ember.isPresent(filteredItem)) {
            return filteredItem.get('length') - 1;
        }

        return 0;
    }),
    firstItemLabel: Ember.computed('hiddenItemsCount', function () {
        let filteredItem = this.get('filteredItem').get(this.get('column.field'));
        if (Ember.isPresent(filteredItem)) {
            return Ember.get(Ember.A(filteredItem).get('firstObject'), this.get('column.arrayLabelPath'));
        }
        return;
    }),
    isLinksReadOnly: Ember.computed('column.disableLink', {
        get() {
            return this.get('column.disableLink');
        }
    }),
    firstItem: Ember.computed('hiddenItemsCount', function () {
        let filteredItem = this.get('filteredItem').get(this.get('column.field'));
        if (Ember.isPresent(filteredItem)) {
            return Ember.A(filteredItem).get('firstObject');
        }
        return;
    }),
    isShowMoreList: Ember.computed('showMoreList', function () {
        let showMoreList = this.get('showMoreList');
        return showMoreList;
    }),
    clickOutside() {
        this.set('showMoreList', false);
    },
    handleScroll(e) {
        let target = e.target,
            element = this.get('element');
        if (target && target !== document && target.contains(element) && element.offsetTop < target.scrollTop) {
            this.clickOutside();
        }
        this.setDropdownPosition();
    },
    isDropDownShown: Ember.observer('isShowMoreList', function () {
        if (this.get('isShowMoreList')) {
            Ember.run.next(() => {
                this.setDropdownPosition();
            });
        }
    }),
    setDropdownPosition() {
        if (Ember.isEmpty(this.get('element'))) {
            return;
        }
        let element = this.get('element'),
            dropDownElement = document.getElementById(`${this.get('elementId')}-dropdown`);
        if (element && dropDownElement) {
            let position = element.getBoundingClientRect(),
                left = position.left + parseInt(window.getComputedStyle(element).paddingLeft),
                right = position.right,
                dropdownHeight = dropDownElement.clientHeight,
                totalHeight = position.bottom + dropdownHeight,
                top;
            //first time setup
            if (Ember.isEmpty(this.get('modalAnimationTop')) || Ember.isEmpty('modalAnimationBottom')) {
                if (totalHeight > window.innerHeight) {
                    this.set('modalAnimationTop', true);
                    this.set('modalAnimationBottom', false);
                } else {
                    this.set('modalAnimationBottom', true);
                    this.set('modalAnimationTop', false);
                }
            }
            //set position based on setup
            if (this.get('modalAnimationTop')) {
                top = position.bottom - dropdownHeight;
            }
            if (this.get('modalAnimationBottom')) {
                top = position.top;
            }
            if (right > window.innerWidth) {
                left = left - (window.innerWidth - right);
            }
            dropDownElement.style.cssText = `left: ${left}px; top: ${top}px;`;
        }
    },
    actions: {
        showToolTip(data) {
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: true
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        }
    }
});