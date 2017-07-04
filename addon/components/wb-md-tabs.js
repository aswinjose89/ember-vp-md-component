import Ember from 'ember';
import layout from '../templates/components/wb-md-tabs';
import ComponentHelper from '../mixins/component-helper';
import truthConvert from 'wb-ui-md-components/utils/truth-convert';
const {
    getOwner
} = Ember;

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['global-tabs', 'global-tabs_slider'],
    classNameBindings: [
        'isLite:global-tabs_color_light'
    ],
    selectedIndex: 0,
    isButton: false,
    isLite: false,
    isDeleteDisable: false,
    isDomClick: true,
    tabListPositionX: 0,
    slideDirection: null,
    isStatic: false,
    isFluid: false,
    isLastTabDeletable: false,
    confirmationConfig: {
        cancelButtonLabel: 'Cancel',
        confirmButonLabel: 'Delete',
        title: 'Delete',
        message: `Do you want to delete this tab?`
    },
    isTriggerClickOnLoad: true,
    selectObserver: Ember.observer('selectedIndex', function () {
        Ember.run.scheduleOnce('afterRender', this, function () {
            this.send('openTab', this.get('selectedIndex'));
        });
    }),
    iconColor: Ember.computed("isLite", {
        get() {
            return (this.get("isLite")) ? "white" : "";
        }
    }),
    isLastTab: Ember.computed('tabs.length', function () {
        if (this.get("tabs").length === 1 && !this.get('isLastTabDeletable')) {
            return true;
        }
        return;
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        this.get("tabs").forEach(tab => {
            if (tab.get("subRoute")) {
                tab.set("route", `${this.get("route")}.${tab.get("subRoute")}`);
            } else {
                tab.set("route", this.get("route"));
            }
            tab.set('id', (tab.get('id') ? tab.get('id') : ''));
        });
        if (this.get("routable")) {
            if (!truthConvert(this.get("route"))) {
                throw new Error("(route) property should not be empty.");
            }
        }

    },
    isLeftNavActive: false,
    isRightNavActive: false,
    setTransformStyle: Ember.observer('tabListPositionX', function () {
        if (this.get("tabListPositionX") > 0) {
            this.set("isLeftNavActive", true);
        } else if (this.get("tabListPositionX") === 0) {
            this.set("isLeftNavActive", false);
        }
        if (Ember.isEmpty(this.get("element"))) {
            return;
        }
        let globalTabs = this.get("element").querySelectorAll(".global-tabs__element");
        if (Ember.isPresent(globalTabs)) {
            let w = 0,
                tabList = this.get("element").querySelector(".global-tabs__list");
            Array.prototype.forEach.call(globalTabs, (el) => {
                w += el.clientWidth;
            });
            if (Ember.isPresent(tabList)) {
                if (this.get("tabListPositionX") >= (w - tabList.clientWidth)) {
                    this.set("isRightNavActive", false);
                }
                tabList.setAttribute("style", `transform: translateX(-${this.get("tabListPositionX")}px)`);
            }
        }
    }),
    checkLeftNav(index) {
        let el = this.get("element");
        this.set("isLeftNavActive", (el.querySelectorAll(".global-tabs__element")[index].offsetLeft + el.querySelectorAll(".global-tabs__element")[index].offsetWidth > el.clientWidth));
    },
    getActiveElement() {
        if (truthConvert(this.get("tabs"))) {
            return this.get("element").querySelectorAll(".global-tabs__list .global-tabs__element")[this.get("selectedIndex")];
        }
    },
    checkRightNav: Ember.computed('tabs.length', function () {
        let el = this.get("element"),
            tabList = el.querySelector(".global-tabs__list"),
            activeEl = this.getActiveElement();
        this.set("isDeleteDisable", this.get('isLastTab'));
        if (activeEl) {
            var w = 0,
                tabs = Array.prototype.slice.call(tabList.querySelectorAll(".global-tabs__element"));
            if (this.get("selectedIndex") + 1 <= tabs.length) {
                tabs.splice(this.get("selectedIndex") + 1, tabs.length).forEach(function (el) {
                    w += el.clientWidth;
                });
                var calcEl = el.clientWidth - (activeEl.clientWidth + activeEl.offsetLeft);
                this.set("isRightNavActive", (w > calcEl && w !== 0));
            } else {
                this.set("isRightNavActive", false);
            }
        }
        return true;
    }),
    setActive(index) {
        if (index >= 0 && this.get('tabs.length') > 0) {
            this.get("tabs").forEach(tab => {
                tab.set("isActive", false);
            });
            this.get("tabs")[index].set("isActive", true);
            this.setActiveBar(index);
        }
    },
    calcSlideDirection(newIndex, oldIndex) {
        if (newIndex > oldIndex) {
            this.set('slideDirection', 'global-tabs__slide-line_direction_right');
        } else {
            this.set('slideDirection', 'global-tabs__slide-line_direction_left');
        }
    },
    didRender() {
        this._super(...arguments);
        this.get("checkRightNav");
    },
    willUpdate() {
        Ember.run.scheduleOnce('afterRender', this, () => {
            this.setActiveBar(this.get('selectedIndex'));
        });
    },
    didInsertElement() {
        this._super(...arguments);
        Ember.run.later(() => {
            if (this.get("routable")) {
                if (this.get("element").querySelector(".global-tabs__element.active")) {
                    Array.from(this.get("element").querySelectorAll(".global-tabs__element")).forEach((el, idx) => {
                        if (el.classList.contains("active")) {
                            el.classList.add("global-tabs__element_status_active");
                            this.get("tabs")[idx].set("isActive", true);
                            this.set("selectedIndex", idx);
                        }
                    });
                    if (this.get("selectedIndex") === this.get("tabs").length - 1) {
                        this.set("isRightNavActive", false);
                    }
                    this.checkLeftNav(this.get("selectedIndex"));
                    this.get("setTransformStyle");
                }
            }
            this.send("openTab", this.get("selectedIndex"));
        }, 100);
    },
    sliderStyle(elementOffsetWidth, tabOffsetWidth, tabOffsetLeft, el) {
        let calcRight = elementOffsetWidth - (tabOffsetWidth + tabOffsetLeft);
        el.querySelector(".global-tabs__slide-line").setAttribute("style",
            `left:${tabOffsetLeft}px;right:${calcRight}px;min-width:${tabOffsetWidth}px;`
        );
    },
    sliderTransition(elementOffsetWidth, tabOffsetWidth, tabOffsetLeft, el) {
        let xPos = 0,
            emptySpaceInPixels = el.querySelector(".global-tabs__control").clientWidth;
        if (elementOffsetWidth < (tabOffsetLeft + tabOffsetWidth + emptySpaceInPixels) && truthConvert(this.get("tabs"))) {
            xPos = (tabOffsetLeft + tabOffsetWidth) - (elementOffsetWidth - emptySpaceInPixels);
        }
        this.set("tabListPositionX", xPos);
    },
    setActiveBar(index) {
        if (index >= 0  && this.get('tabs.length') > 0) {
            let tabs = this.get("element").querySelectorAll(".global-tabs__element"),
                elementOffsetWidth = this.get("element").querySelector('.global-tabs__list').offsetWidth,
                tabOffsetWidth = tabs[index].offsetWidth,
                tabOffsetLeft = tabs[index].offsetLeft,
                tabError = this.get(`tabs.${index}.isError`);
            if (tabError) {
                this.set('slideLineIsError', true);
            } else {
                this.set('slideLineIsError', false);
            }
            this.sliderStyle(elementOffsetWidth, tabOffsetWidth, tabOffsetLeft, this.get("element"));
        }
    },
    triggerOpenTabAction() {
        let index = this.get('selectedIndex');
        if (this.get("onClick")) {
            if (this.get('isTriggerClickOnLoad')) {
                this.wbActionHandler("onClick", [index]);
            }
            this.set('isTriggerClickOnLoad', true);
        }
    },
    actions: {
        removeTab(index, tab) {
            Ember.set(this.get('confirmationConfig'), 'actionableTab', tab);
            this.mdDialogManager.confirm(this.get('confirmationConfig')).then(() => {
                this.get("tabs").removeAt(index);
                var delEl = this.get("element").querySelectorAll(".global-tabs__element")[index];

                if (this.get("tabListPositionX") > 0) {
                    this.set("tabListPositionX", (this.get("tabListPositionX") > delEl.clientWidth) ? this.get("tabListPositionX") - delEl.clientWidth : 0);
                }
                this.get("element").querySelectorAll(".global-tabs__element")[index].remove();
                if (index === this.get("selectedIndex") && index === 0 && !this.get('isLastTabDeletable')) {
                    this.set("selectedIndex", -1);
                    Ember.run.next(() => {
                        this.set("selectedIndex", 0);
                    });
                } else if (index <= this.get("selectedIndex")) {
                    this.set("selectedIndex", this.get("selectedIndex") - 1);
                }
                this.setActive(this.get("selectedIndex"));
                this.set("isDomClick", false);
                if (this.get("routable")) {
                    this.get("element").querySelectorAll(".global-tabs__element")[this.get("selectedIndex")].querySelector("a").click();
                }
                this.set("isDomClick", true);
                Ember.tryInvoke(this, 'onDelete', [index, tab]);
            });
            return false;
        },
        moveLeft() {
            if (this.get("tabListPositionX") > 0) {
                this.set("tabListPositionX", (this.get("tabListPositionX") > 100) ? this.get("tabListPositionX") - 100 : 0);
                this.set("isRightNavActive", true);
            }
        },
        moveRight() {
            var tabList = this.get("element").querySelector(".global-tabs__list");
            if (tabList.scrollWidth > tabList.clientWidth) {
                var hiddenWidth = tabList.scrollWidth - tabList.clientWidth,
                    remainingWidth = hiddenWidth - this.get("tabListPositionX");
                this.set("tabListPositionX", this.get("tabListPositionX") + (remainingWidth > 100 ? 100 : remainingWidth));
                if (this.get("tabListPositionX") >= hiddenWidth) {
                    this.set("isRightNavActive", false);
                }
                this.set("isLeftNavActive", true);
            }
        },
        openTab(index) {
            if (index >= 0) {
                if (this.get("isDomClick") && Ember.isPresent(this.get("element"))) {
                    var wrapperEl = this.get("element").querySelector(".global-tabs__list-wrapper").getBoundingClientRect();
                    var activeElement = this.get("element").querySelectorAll(".global-tabs__element")[index];
                    var activeEl = activeElement.getBoundingClientRect();
                    if (wrapperEl.right < activeEl.right) {
                        this.set("tabListPositionX", this.get("tabListPositionX") + (activeEl.right - wrapperEl.right));
                    } else if (wrapperEl.left > activeEl.left) {
                        this.set("tabListPositionX", (this.get("tabListPositionX") - (wrapperEl.left - activeEl.left) < 0 ? 0 : this.get("tabListPositionX") - (wrapperEl.left - activeEl.left)));
                        this.set('isRightNavActive', true);
                    }
                    this.calcSlideDirection(index, this.get('selectedIndex'));
                    Ember.run.schedule("afterRender", this, function () {
                        this.set("selectedIndex", index);
                        this.setActive(index);
                        if (this.get("routable")) {
                            activeElement.classList.add("global-tabs__element_status_active");
                        }
                    });
                }
                Ember.run.debounce(this, this.triggerOpenTabAction, 200);
            }
        }
    }
});
