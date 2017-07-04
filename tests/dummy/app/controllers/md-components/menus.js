import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        menuAction(item){
            console.log("Controller action: menuAction", item);
        },
        deleteRecord(item){
            console.log("Controller action: Delete", item);
        },
        newRecord(item){
            console.log("Controller action: New", item);
        },
        viewRecord(item){
            console.log("Controller action: View", item);
        },
        editRecord(item){
            console.log("Controller action: Edit", item);
        },
        onSelectView(){
            console.log('Select view');
        },
        onSelectAll(){
            console.log('Select all');
        },
        iconToolbarAction(item){
            console.log('icon-toolbar child component action', item);
        },
        test(item){
            console.log("Controller action: Test", item);
        },
        triggerTrigger() {
            console.log(this.set('actionMenuGroupHeaderConfig.triggerElement.config.label', 'New Label'));
        }
    }
});
