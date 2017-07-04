import Ember from 'ember';

export default Ember.Mixin.create({
    showMDToggleSideBar: true,
    isMDFluidLayout: true,
    actions: {
        floatsidebar() {
            this.toggleProperty('showMDToggleSideBar');
            this.updateApplicationProperty('showMDToggleSideBar', this.get('showMDToggleSideBar'));
        }
    }
});