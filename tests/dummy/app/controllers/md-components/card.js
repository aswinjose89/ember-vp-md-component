import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        deleteAction(index){
            //this.get("classicHeaderContent").removeAt(index);
            console.log(index);
        },
    }
});
