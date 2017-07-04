import Ember from 'ember';
import layout from '../templates/components/wb-md-routable-tabs';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: "global-tabs",
    classNameBindings: [
        'isLite:global-tabs_color_light'
    ],
    defaultTab: 0,
    isButtonType: Ember.computed("type", {
        get(){
            return (this.get("type") === "button");
        }
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    setActiveBar(index, old) {
        let tabs = this.get("element").querySelectorAll(".global-tabs__element"),
            elementOffsetWidth = this.get("element").offsetWidth,
            tabOffsetWidth = tabs[index].offsetWidth,
            tabOffsetLeft = tabs[index].offsetLeft,
            calcRight = elementOffsetWidth - (tabOffsetWidth + tabOffsetLeft);
        if (!Ember.isEmpty(old)) {
            if (old < index) {
                this.set('slideDirection', 'global-tabs__slide-line_direction_right');
            }
            else {
                this.set('slideDirection', 'global-tabs__slide-line_direction_left');
            }
        }
        this.get("element").querySelector(".global-tabs__slide-line").setAttribute("style",
            `left:${tabOffsetLeft}px;right:${calcRight}px;`
        );
    },
    didInsertElement: function () {
        this.setActiveBar(this.get('defaultTab'));
    },
    actions: {
        activateBar(tab, index) {
            this.setActiveBar(index, this.get('defaultTab'));
            this.set("defaultTab", index);
            if (this.get("onClick")) {
                this.get("onClick")(tab, index);
            }
        }
    }
});
