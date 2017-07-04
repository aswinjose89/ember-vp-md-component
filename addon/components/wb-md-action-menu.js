import Ember from 'ember';
import layout from '../templates/components/wb-md-action-menu';
import ComponentHelper from '../mixins/component-helper';
import ClickOutside from '../mixins/click-outside';
import scrollListener from '../mixins/scroll-listener';

export default Ember.Component.extend(ComponentHelper, ClickOutside, scrollListener, {
    layout,
    isOpen: false,
    classNames: ['global-menu'],
    classNameBindings: [
        'isOpen:global-menu_open'
    ],
    closeOnClickOutside: false,
    triggerElement: Ember.Object.create({
        componentName: 'wb-md-icon',
        config: Ember.Object.create({
            iconName: 'more_vert'
        })
    }),
    onOpen: Ember.observer('isOpen', function () {
        if (this.get('isOpen')) {
            this.setPosition();
        } else {
            this.set('modalPosition', '');
        }
    }),
    defaultLabel: null,
    setLabel: Ember.computed('computedLabel', function () {
        if (!Ember.isEmpty('computedLabel')) {
            this.set('triggerElement.config.label', this.get('computedLabel') ? this.get('computedLabel') : this.get('defaultLabel'));
        }
    }),
    changeLabel: Ember.observer('computedLabel', function () {
        if (!Ember.isEmpty('computedLabel')) {
            this.set('triggerElement.config.label', this.get('computedLabel') ? this.get('computedLabel') : this.get('defaultLabel'));
        }
    }),
    computedLabel: null,
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        this.setupGroups();
        this.initializeObservers();
        this.set('defaultLabel', this.get('triggerElement.config.label'));
        this.get('setLabel');
        this.get('changeLabel');
    },
    clickOutside() {
        this.set('isOpen', false);
    },
    setPosition() {
        var x = !Ember.isEmpty(this.get('position.x')) ? this.get('position.x') : 'right',
            y = !Ember.isEmpty(this.get('position.y')) ? this.get('position.y') : 'bottom';
        this.set('modalPosition', ` global-menu__modal_position_${y}-${x}`);
        let modal = this.get('element').querySelector('.global-menu__modal'),
            modalPosition = function () {
                modal.style.display = "block";
                let pos = modal.getBoundingClientRect();
                modal.style.display = "";
                return pos;
            }(),
            maxPositionX,
            maxPositionY;
        if (document.querySelector('.global-popup__content') && document.querySelector('.global-popup__content').contains(modal)) {
            maxPositionX = document.querySelector('.global-popup__content').getBoundingClientRect();
            maxPositionY = maxPositionX;
        } else if (document.querySelector('.page__main') && document.querySelector('.page__main').contains(modal)) {
            maxPositionX = document.querySelector('.page__main').getBoundingClientRect();
            maxPositionY = document.querySelector('.page__container-scroll').getBoundingClientRect();
        } else {
            maxPositionX = document.body.getBoundingClientRect();
            maxPositionY = maxPositionX;
        }
        if ((modalPosition.top - modalPosition.height > maxPositionY.top) && (modalPosition.bottom > maxPositionY.bottom)) {
            y = 'top';
        } else if (modalPosition.top - modalPosition.height < maxPositionY.top) {
            y = 'bottom';
        }
        if (modalPosition.left - modalPosition.width < maxPositionX.left) {
            x = 'left';
        } else if (modalPosition.right + modalPosition.width > maxPositionX.right) {
            x = 'right';
        }
        if (x !== this.get('position.x') || y !== this.get('position.y')) {
            x = x !== this.get('position.x') ? x : this.get('position.x');
            y = y !== this.get('position.y') ? y : this.get('position.y');
            this.set('modalPosition', ` global-menu__modal_position_${y}-${x}`);
        }
    },
    subItemPosition(el) {
        var modalPosition = 0,
            docPosition = this.findClosestScrolledParent(this.get('element')).getBoundingClientRect();
        if (el.srcElement.parentNode.querySelector(".global-menu__modal_show")) {
            let item = el.srcElement.parentNode.querySelector(".global-menu__modal_show");
            this.set('tempModal', item);
            item.removeAttribute('style');
            modalPosition = item.getBoundingClientRect();
            if (Math.round(docPosition.left + docPosition.width) < Math.round(modalPosition.left + modalPosition.width)) {
                item.classList.add('global-menu__modal_sub-position_left');
            }
            if (modalPosition.bottom > docPosition.bottom) {
                let h = docPosition.bottom - modalPosition.bottom - 10;
                item.style.transform = `translateY(${h}px)`;
            }
        }
    },
    setupGroups() {
        let items = this.get('items').filter(item => {
            return item.groupHeader;
        });
        items.map(item => {
            let groupItems = item.items,
                groupHeader = item.groupHeader;
            groupItems.forEach(item => {
                if (item.isSelected === true) {
                    this.setComputedLabel(item, groupHeader);
                    return;
                }
            });
        });
    },
    unselectGroups() {
        let items = this.get('items').filter(item => {
            return Ember.get(item, 'groupHeader');
        });
        items.map(item => {
            let groupItems = item.get('items');
            groupItems.setEach('isSelected', false);
        });
    },
    setComputedLabel(item, group) {
        Ember.set(item, 'isSelected', true);
        this.set('computedLabel', `${group} / ${item.label}`);
    },
    initializeObservers() {
        let items = this.get('items');
        if (Ember.isEmpty(items)) {
            return;
        }
        items.forEach((item) => {
            if (item.hasOwnProperty('items') && !item.hasOwnProperty('isNotTrigger')) {
                let isChildItemSelected = item.get('items').isAny('isSelected', true);
                if (isChildItemSelected) {
                    item.set('indeterminate', true);
                }
                item.addObserver('items.@each.isSelected', item, this.subMenuObserver.bind(item, this));
            }
        });
    },
    subMenuObserver(obj, item) {
        let childSelectedItems = item.get('items').filterBy('isSelected', true),
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
        if (item.get('groupHeader') && childSelectedItemsLength > 0) {
            obj.setComputedLabel(childSelectedItems[0], item.get('groupHeader'));
        }
    },
    manualCleanHighlight: Ember.on('willDestroyElement', function () {
        let items = Ember.A(this.get('items'));
        if (items.length > 0) {
            items.setEach('isHighLight', false);
        }
    }),
    actions: {
        setDropItemHighLight(item, event) {
            if (Ember.isEmpty(event)) {
                return;
            }
            Ember.set(item, 'isHighLight', true);
        },
        unSetDropItemHighLight(item) {
            Ember.set(item, 'isHighLight', false);
        },
        triggerSendAction(actionName, item, groupHeader, subItem) {
            this.set(actionName, actionName); //Resend action hack :(
            if (this.get("onClick")) {
                this.get("onClick")(actionName);
            } else {
                this.sendAction(actionName, item);
            }
            if (!Ember.isEmpty(groupHeader)) {
                this.unselectGroups();

                item.set('isSelected', true);
            } else {
                let computedLabel = this.get('computedLabel');
                if (!Ember.isEmpty(computedLabel)) {
                    this.set('computedLabel', null);
                }
            }
            if (Ember.isPresent(Ember.get(item, 'isToggleSelection'))) {
                item.toggleProperty('isSelected');
            }
            if ((Ember.isEmpty(subItem) || !subItem) && !this.get('closeOnClickOutside')) {
                this.clickOutside();
            }
        },
        addSubMenus(item) {
            item.set("showSubmenu", true);
            var el = event;
            Ember.run.next(this, function () {
                this.subItemPosition(el);
            });
        },
        removeSubMenus(item) {
            if (Ember.isPresent(this.get('tempModal'))) {
                this.get('tempModal').removeAttribute('style');
                this.set('tempModal', null);
            }
            item.set("showSubmenu", false);
        },
        toggleSelectItem(item, actionName, disableSelection) {
            if (item.get('type') === 'parent' && item.get('isNotTrigger')) {
                return;
            }
            if (!disableSelection) {
                this.set('computedLabel', null);
                item.set("isSelected", !item.get("isSelected"));
                if (item.hasOwnProperty('items') && !item.hasOwnProperty('isNotTrigger')) {
                    let isSelect = item.get("isSelected");
                    item.get('items').forEach(item => {
                        item.set('isSelected', isSelect);
                    });
                }
            } else {
                this.clickOutside();
            }
            if (actionName) {
                this.send('triggerSendAction', actionName, item, null, true);
            }
        }
    }
});