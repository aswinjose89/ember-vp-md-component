import Ember from 'ember';
import layout from '../templates/components/wb-md-tabs-content';

export default Ember.Component.extend({
    layout,
    tagName: '',
    setContentVisible: Ember.computed("selectedIndex", function () {
        this.get("childViews").forEach((item) => {
            item.set("isOpen", false);
        });
        var index = (!Ember.isEmpty(this.get("selectedIndex")) ? this.get("selectedIndex") : 0);
        if (this.get("childViews")[index]) {
            this.get("childViews")[index].set("isOpen", true);
        }
    }),
    didRender() {
        this._super(...arguments);
        this.get("setContentVisible");
    }
});