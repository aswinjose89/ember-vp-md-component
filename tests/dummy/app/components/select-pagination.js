import Ember from 'ember';
import layout from '../templates/components/select-table-result';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    selectedUsers: Ember.A(),
    userContent: Ember.A(),
    init(){
        this._super(...arguments);
        this.set('userSearchConfig',{
              label: 'User Countries',
              remoteSearch: true,
              pageable: true,
              pageSize: 10,
              optionValuePath: "id",
              optionLabelPath: "name",
              multiple: true
          });
    },
    actions:{
        userQueryAction(filters){
            //A little hack to get more results from mock
            filters = JSON.parse(filters);
            filters.searchKey = '';
            filters = JSON.stringify(filters);
            return this.get('store').query('country',{filters});
        },
        selectBoxOpened(){
            let userContent = this.get('store').query('country',{searchValue:'ren'});
            this.set('userContent', userContent);
        }
    }
});
