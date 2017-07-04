import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        controller.set("tableTabsConfig", {
            routable: true,
            isLite: true,
            isStatic: true,
            route: "md-components.tables",
            tabs: Ember.A([
                Ember.Object.create({
                    label: "Satic Table",
                    subRoute: "static"
                }),
                Ember.Object.create({
                    label: "Table With Actions",
                    subRoute: "actions"
                }),
                Ember.Object.create({
                    label: "Editable Table",
                    subRoute: "editable"
                }),
                Ember.Object.create({
                    label: "Multi Select Table",
                    subRoute: "multiselect"
                }),
                Ember.Object.create({
                    label: "Pageable Table",
                    subRoute: "pageable"
                }),
                Ember.Object.create({
                    label: "Nested Table",
                    subRoute: "nested"
                })
            ])
        });
    }
});