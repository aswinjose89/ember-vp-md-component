import Ember from 'ember';

export default Ember.Controller.extend({
    card1: false,
    card2: true,
    card3: false,
    card4: false,
    actions: {
        showTabContent(tab, index) {
            console.log(tab);
            console.log(index);
        },
        showCard(id) {
            if(!Ember.isEmpty(id)){
                this.set("buttonTabsContentIndex", id);
            }
        },
        addTab(){
            this.get("classicHeaderContent").pushObject(
                Ember.Object.create({"label": "Tab "+(this.get("classicHeaderContent").length + 1)})
            );
            this.set('defaultTab', this.get("classicHeaderContent").length - 1);
        },
        deleteAction(){
            //this.get("classicHeaderContent").removeAt(index);
            console.log('deleteAction', ...arguments);
        },
        deleteRoutableTab(index){
            //this.get("routableHeaderContent").removeAt(index);
            console.log(index);
        },
        liteToggle(){
            if(this.get("buttonTabsConfig.isLite")){
                this.set("buttonTabsConfig.isLite", false);
            }
            else{
                this.set("buttonTabsConfig.isLite", true);
                this.set("buttonTabsConfig.isButton", false);
            }

        },
        buttonTabClickHandler(index){
            console.log(index);
        },
        buttonToggle(){
            if(this.get("buttonTabsConfig.isButton")){
                this.set("buttonTabsConfig.isButton", false);
            }
            else{
                this.set("buttonTabsConfig.isLite", false);
                this.set("buttonTabsConfig.isButton", true);
            }

        }
    }
});
