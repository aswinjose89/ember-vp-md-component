import Ember from 'ember';
import layout from '../templates/components/wb-md-static-info';
import ComponentHelper from '../mixins/component-helper';
import ClickOutside from '../mixins/click-outside';
import scrollListener from '../mixins/scroll-listener';

export default Ember.Component.extend(ComponentHelper, ClickOutside, scrollListener, {
    layout,
    classNames: ['static-info'],
    classNameBindings: [
        'updateSize',
        'updateColor',
        'isDisabled:static-info_status_disabled',
        'inline:static-info_inline'
    ],
    showMore: false,
    showLength: 240,
    visibleLines: 3,
    showTrigger: false,
    listLimit: null,
    isEmptyList: false,
    showListFull: false,
    enableScrollListener: false,
    inline: false,
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    isContentHidden: Ember.computed('showLength', 'content', function () {
        let replacedContent = this.adjustLineBreak(this.get('content')),
            newLines = Ember.isPresent(replacedContent) ? replacedContent.match(/\r\n/g) : '',
            isHideNewLines = (Ember.isPresent(newLines) && newLines.length >= this.get('visibleLines'));
        return ((!Ember.isEmpty(this.get('content')) && this.get('showLength') < replacedContent.length) || (isHideNewLines));
    }),
    updateIconColor: Ember.computed('color', 'iconColor', 'iconName', function () {
        if (!Ember.isEmpty(this.get('iconName')) && Ember.isEmpty(this.get('iconColor')) && !Ember.isEmpty(this.get('color'))) {
            this.set('iconColor', this.get('color'));
        }
    }),
    updateSize: Ember.computed('size', function () {
        if (!Ember.isEmpty(this.get('size'))) {
            return 'static-info_size_' + this.get('size');
        }
    }),
    updateColor: Ember.computed('color', function () {
        if (!Ember.isEmpty(this.get('color'))) {
            return 'static-info_color_' + this.get('color');
        }
    }),
    showListLimitedArray: Ember.computed('list', 'listLimit', function () {
        let list = this.get('list'),
            listLimit = this.get('listLimit');
        if (Ember.isEmpty(list) || Ember.isEmpty(listLimit)) {
            this.set('enableScrollListener', false);
            return;
        }
        let listLimitNum = list.length - parseInt(listLimit),
            listLimitArray = list.slice(0, listLimit),
            listLimitLastIndex = --listLimit,
            isEmptyList = (listLimitNum === 0) ? true : false;
        this.setProperties({
            listLimitLastIndex: listLimitLastIndex,
            listLimitNum: `+ ${listLimitNum}`,
            isEmptyList: isEmptyList,
            listLimitArray: listLimitArray,
            enableScrollListener: true
        });
        return true;
    }),
    clickOutside() {
        this.set('showListFull', false);
        this.set('modalAnimationTop', null);
        this.set('modalAnimationBottom', null);
    },
    isDropDownShown: Ember.observer('showListFull', function () {
        if (this.get('showListFull')) {
            Ember.run.next(() => {
                this.setDropdownPosition();
            });
        }
    }),
    handleScroll(e) {
        let target = e.target,
            element = this.get('element');
        if (target && target !== document && target.contains(element) && element.offsetTop < target.scrollTop) {
            this.clickOutside();
        }
        this.setDropdownPosition();
    },
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
                top = position.top - dropdownHeight;
            }
            if (this.get('modalAnimationBottom')) {
                top = position.top + position.height;
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