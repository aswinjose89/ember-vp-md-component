import Ember from 'ember';

export default Ember.Object.create({
    isEditable: true,
    initEditableTable(){
        this.set(this.get('addNewRowAction'),this.get('addNewRowAction'));
    }
});
