import Ember from 'ember';
import layout from '../templates/components/user-search';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    selectedUsers: Ember.A([
        Ember.Object.create({
            name: "Singapore",
            id: "SG"
        })
    ]),
    selectedUser: Ember.Object.create({
        name: "Singapore",
        id: "SG"
    }),
    init() {
        this._super(...arguments);
        this.set('userSearchConfig', {
            label: 'User Countries',
            required: true,
            remoteSearch: true
        });
    },
    actions: {
        userQueryAction(query) {
            Ember.Logger.log('search Query', query);

            return this.get('store').query('country', { searchValue: query });
        },
        selectionChanged() {
            Ember.Logger.log('Selection Changed', ...arguments);
        }
    }
});