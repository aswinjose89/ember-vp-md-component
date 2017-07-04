import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        controller.set("pageableTabsConfig", {
            routable: true,
            isStatic: true,
            route: "md-components.tables.pageable",
            tabs: Ember.A([
                Ember.Object.create({
                    label: "Deafault Pagination",
                    subRoute: "default"
                }),
                Ember.Object.create({
                    label: "Loadmore",
                    subRoute: "loadmore"
                }),
                Ember.Object.create({
                    label: "Infinite",
                    subRoute: "infinite"
                })
            ])
        });
    }
});