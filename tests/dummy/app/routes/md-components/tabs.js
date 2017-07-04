import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        controller.set('defaultTab', 2);
        controller.set("isButton", true);
        controller.set("isLite", false);
        controller.set("headerContent", Ember.A([
            Ember.Object.create({
                "label": "Some extremely long description",
                "id": 1
            }),
            Ember.Object.create({
                "label": "GROUPS",
                "id": 2
            }),
            Ember.Object.create({
                "label": "CLIENTS",
                "id": 3,
                "disabled": true
            }),
            Ember.Object.create({
                "label": "SELECTED",
                "id": 4
            }),
            Ember.Object.create({
                "label": "Individual",
                "id": 5,
                "disabled": true
            }),
            Ember.Object.create({
                "label": "Individual1",
                "id": 6
            }),
            Ember.Object.create({
                "label": "Individual2",
                "id": 7
            }),
            Ember.Object.create({
                "label": "SELECTED",
                "id": 8
            }),
            Ember.Object.create({
                "label": "Individual",
                "id": 9,
                "disabled": true
            }),
            Ember.Object.create({
                "label": "Individual1",
                "id": 10
            }),
            Ember.Object.create({
                "label": "Last Tab",
                "value": "10,003",
                "id": 11
            })
        ]));

        controller.set("buttonHeaderContent", Ember.A([
            Ember.Object.create({
                "label": "Some extremely long description",
                "id": 1
            }),
            Ember.Object.create({
                "label": "GROUPS",
                "id": 2
            }),
            Ember.Object.create({
                "label": "CLIENTS",
                "id": 3,
                "disabled": true
            }),
            Ember.Object.create({
                "label": "SELECTED",
                "id": 4
            }),
            Ember.Object.create({
                "label": "SELECTED",
                "id": 8
            })
        ]));
        controller.set("classicHeaderContent", Ember.A([
            Ember.Object.create({ label: "Tab 1", isReadOnly: true }),
            Ember.Object.create({ label: "Tab 2", isError: true }),
            Ember.Object.create({ label: "Tab 3" }),
            Ember.Object.create({ label: "Tab" }),
        ]));

        controller.setProperties(Ember.Object.create({
            classicDefaultActiveTab: 1,
            buttonTabsContentIndex: 1,
            buttonTabsConfig: {
                "isButton": true,
                "isDeletable": true,
                "tabs": controller.get("buttonHeaderContent"),
                isTriggerClickOnLoad: false
            },
            buttonTabsContentConfig: {
                "content": controller.get("tabContent")
            },
            classicTabsConfig: {
                "isDeletable": true,
                "confirmationConfig": {
                    cancelButtonLabel: 'No',
                    confirmButonLabel: 'Yes',
                    title: 'Delete Custom Title',
                    message: Ember.computed('actionableTab', function () {
                        return `<p>Custom Information</p><p>Are you sure to perform the action on ${Ember.get(this, 'actionableTab.label')}?</p>`;
                    })
                },
                "tabs": controller.get("classicHeaderContent")
            },
            liteTabsConfig: {
                "isStatic": true,
                "isLite": true,
                "tabs": controller.get("headerContent")
            }
        }));

        controller.set("tabContent", Ember.A([{
                title: "First tab",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non dui ac lorem pretium gravida. Praesent laoreet feugiat mauris et ultrices. <span style='color:red'>AM HERE</span>Suspendisse et sapien ut dolor suscipit pulvinar. Praesent mattis pretium ex sed mattis. Donec interdum neque arcu, et lacinia erat dictum a."
            }, {
                title: "Second tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }, {
                title: "Third tab",
                content: "Aliquam tellus enim, vulputate quis feugiat blandit, malesuada sit amet est. Quisque tincidunt est nec lectus maximus dictum. In hac habitasse platea dictumst."
            }, {
                title: "Fourth tab",
                content: "Sed in cursus ex, nec tempus augue. Donec sed lacinia leo. Proin sed lacinia lorem. In eu pretium arcu. Proin vel varius enim, et facilisis magna."
            }, {
                title: "Fifth tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }, {
                title: "Sixth tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }, {
                title: "Seventh tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }, {
                title: "Eighth tab",
                content: "Sed in cursus ex, nec tempus augue. Donec sed lacinia leo. Proin sed lacinia lorem. In eu pretium arcu. Proin vel varius enim, et facilisis magna."
            }, {
                title: "Nineth tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }, {
                title: "Tenth tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }, {
                title: "Eleventh tab",
                content: "Nunc sit amet rutrum neque, a sodales arcu. Phasellus nunc nisi, efficitur eget lectus quis, elementum interdum quam. Sed nec ex non quam ultricies venenatis. Quisque sed fringilla leo."
            }]

        ));
        controller.set("routableHeaderContent", Ember.A([
            Ember.Object.create({
                "label": "Some extremely long description",
                "id": 1,
                "subRoute": "tab"
            }),
            Ember.Object.create({
                "label": "GROUPS",
                "id": 2,
                "subRoute": "tab"
            }),
            Ember.Object.create({
                "label": "CLIENTS Tab",
                "id": 3,
                "subRoute": "tab"
            }),
            Ember.Object.create({
                "label": "CLIENTS Tab 1",
                "subRoute": "tabs",
                "id": {
                    "a": 'section1',
                    "b": 'type1'
                }
            }),
            Ember.Object.create({
                "label": "CLIENTS2",
                "subRoute": "notab"
            }),
            Ember.Object.create({
                "label": "CLIENTS3",
                "id": 6,
                "subRoute": "tab"
            }),
            Ember.Object.create({
                "label": "CLIENTS4",
                "id": 7,
                "subRoute": "tab"
            }),
            Ember.Object.create({
                "label": "SELECTED",
                "id": 8,
                "subRoute": "tab"
            })
        ]));
        controller.set("routableTabConfig", {
            "routable": true,
            "route": "tabs",
            isLite: true,
            "tabs": controller.get("routableHeaderContent")
        });
    },
    actions: {
        clicked() {
            Ember.Logger.log('clicked', ...arguments);
        },
        changeDeaultTab() {
            this.set('controller.defaultTab', 1);
        }
    }
});