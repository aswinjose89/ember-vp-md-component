import Ember from 'ember';

export default Ember.Controller.extend({
    showComment: false,
    showForm: false,
    editForm: true,
    value: `It is a long establ.`,
    testValue: null,
    actions: {
        openCommentForm() {
            console.log('Card Comment form Action');
            this.toggleProperty('showComment');
        },
        openCommentForm2(item) {
            this.set('showForm2', item.get('showForm'));
        },
        editAction() {
            Ember.Logger.log('Edit action invoked');
        },
        deleteAction() {
            Ember.Logger.log('Delete action invoked');
        }
    }
});