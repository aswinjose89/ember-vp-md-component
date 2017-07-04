import Ember from 'ember';
import layout from '../templates/components/select-table-result';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    selectedUsers: Ember.A(),
    resultContent: Ember.A(),
    init() {
        this._super(...arguments);
        this.set('userSearchConfig', {
            label: 'User Countries',
            remoteSearch: true,
            resultType: 'table',
            onChange: 'selectionChanged',
            selectAllAction: 'selectionChanged',
            multiple: true,
            tableConfig: {
                hideToolbar: true,
                multiSelect: true,
                columns: [{
                    field: 'psId',
                    type: 'text',
                    title: 'PSID'
                }, {
                    field: 'firstName',
                    type: 'text',
                    title: 'Name'
                }, {
                    field: 'userCountry',
                    type: 'text',
                    title: 'Country'
                }]
            }
        });
    },
    actions: {
        openAction() {
            this.toggleProperty('isLoading');
            this.get('store').query('user', { searchValue: 'a' }).then((response) => {
                this.toggleProperty('isLoading');
                this.set('resultContent', response);
            });
        },
        userQueryAction(query) {
            Ember.Logger.log('Query user called', query);
            return this.get('store').query('user', { searchValue: query });
        },
        selectionChanged() {
            Ember.Logger.log('selectionChanged called', ...arguments);
        }
    }
});