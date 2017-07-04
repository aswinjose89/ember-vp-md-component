import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super.apply(this, arguments);
        controller.set("inputTabsConfig", {
            routable: true,
            isLite: true,
            isStatic: true,
            route: "md-components.inputs",
            tabs: Ember.A([
                Ember.Object.create({
                    label: "Simple",
                    subRoute: "simple"
                }),
                Ember.Object.create({
                    label: "Date Picker",
                    subRoute: "date"
                }),
                Ember.Object.create({
                    label: "Radio & Checkbox",
                    subRoute: "boolean"
                }),
                Ember.Object.create({
                    label: "Dropdown",
                    subRoute: "dropdown"
                })
            ])
        });
    }
});