import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        controller.set("classicTabsConfig", {
            isDeletable: true,
            isStatic: true,
            tabs: Ember.A([
                Ember.Object.create({ label: "Tab 1" }),
                Ember.Object.create({ label: "Tab 2" }),
                Ember.Object.create({ label: "Tab 3" }),
                Ember.Object.create({ label: "Tab" }),
            ])
        });
    }
});