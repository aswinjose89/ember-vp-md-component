import Ember from 'ember';
import layout from '../templates/components/multi-level-dropdown';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    selectedUsers: Ember.A(),
    userContent: Ember.A(),
    init() {
        this._super(...arguments);
        this.set('userSearchConfig', {
            label: 'User Countries',
            multiLevel: true,
            optionValuePath: "id",
            firstLevelGroupHeader: 'Regions',
            secondLevelGroupHeader: 'Countries',
            optionLabelPath: "name",
            checkBoxSelection: true,
            multiple: true,
            content: this.getSelectBoxContent()
        });
    },
    getSelectBoxContent() {
        return Ember.A([
            Ember.Object.create({
                id: 1,
                name: 'Asia',
                content: Ember.A([
                    Ember.Object.create({
                        id: 11,
                        name: 'China'
                    }),
                    Ember.Object.create({
                        id: 12,
                        name: 'Japan'
                    }),
                    Ember.Object.create({
                        id: 13,
                        name: 'India'
                    })
                ])
            }),
            Ember.Object.create({
                id: 2,
                name: 'Africa',
                content: Ember.A([
                    Ember.Object.create({
                        id: 21,
                        name: 'Algeria'
                    }),
                    Ember.Object.create({
                        id: 22,
                        name: 'Egypt'
                    }),
                    Ember.Object.create({
                        id: 23,
                        name: 'Libya'
                    })
                ])
            }),
            Ember.Object.create({
                id: 3,
                name: 'Europe'
            }),
            Ember.Object.create({
                id: 4,
                name: 'North America'
            })
        ]);
    }
});