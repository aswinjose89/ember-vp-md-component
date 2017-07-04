import Ember from 'ember';
import layout from '../templates/components/wb-md-sidebar-nav-menu-item-label';
//TODO: Fix sidebar issue and remove this interim component
export default Ember.Component.extend({
    layout,
    statusClass: Ember.computed("status", function() {
        this.set("parentView.status", this.get("status"));
        return true;
    }),
    disabledStatus: Ember.computed("isDisabled", function() {
        this.set("parentView.isDisabled", this.get("isDisabled"));
        return true;
    }),
    didRender() {
        this._super(...arguments);
        this.get("statusClass");
        this.get("disabledStatus");
    }
});