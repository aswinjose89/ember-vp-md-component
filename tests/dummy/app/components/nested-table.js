import Ember from 'ember';
import layout from '../templates/components/nested-table';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    actions: {
        menuAction(actionName, content) {
            Ember.Logger.log(arguments, 'invoked');
            this.send(actionName, content);
        },
        tableSelectionChange() {
            Ember.Logger.log('Action from table select', ...arguments);
        },
        viewAction(content) {
            Ember.Logger.log('View Action Called in Route', content);
        },
        newAction(content) {
            Ember.Logger.log('New Action Called in Route', content);
        },
        deleteAction(content) {
            Ember.Logger.log('deleteAction Called in Route', content);
        },
        editAction(content) {
            Ember.Logger.log('editAction Called in Route', content);
        },
        exportAction(content) {
            Ember.Logger.log('exportAction Called in Route', content);
        },
        togglePropertyChanged() {
            Ember.Logger.log('togglePropertyChanged Called in Route', ...arguments);
        },
        newRowAdded() {
            Ember.Logger.log('newRowAdded Called in Route', this.get('controller.newUsers'));
        },
        rowExpandCollapseAction(row) {
            Ember.Logger.log('Expand Row called on ', row);
        },
        linkAction() {
            Ember.Logger.log('Link Action called', ...arguments);
        },
        circleClickAction() {
            Ember.Logger.log('Link Action called');
        },
        userQueryAction(query, nestedChildTableFlag) {
            Ember.Logger.log("userQueryAction called", query, nestedChildTableFlag);
            return new Ember.RSVP.Promise(function(resolve) {
                resolve([]);
            });
        },
        childQueryAction() {
            Ember.Logger.log('childQueryAction from child');
            return new Ember.RSVP.Promise(function(resolve) {
                // on success
                resolve([]);
            });
        }
    }
});