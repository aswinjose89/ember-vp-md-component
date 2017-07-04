import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super.apply(this, arguments);
        controller.setProperties({
            "entityTags": [
                { "key": "3B", "value": "WACG" },
                { "key": "2A", "value": "GROUP CG" },
                { "key": "A+", "value": "S&P" },
                { "key": "MULTI STRIPED" }
            ]
        });
        controller.set('tags', [
            Ember.Object.create({ key: '3B', value: 'America' }),
            Ember.Object.create({ key: '2A', value: 'Taiwan' }),
            Ember.Object.create({ key: 'A+', value: 'Singapore' }),
            Ember.Object.create({ key: 'MULTI STRIPED' })
        ]);
        controller.set('toolTipConfig', {
            label: 'Multiple',
            tooltip: {
                tags: [{
                        config: {
                            color: 'transparent',
                            label: '2 Add',
                            circle: 'green'
                        }
                    },
                    {
                        config: {
                            color: 'transparent',
                            label: '1 Delete',
                            circle: 'red'
                        }
                    }
                ]
            }
        });
    }
});