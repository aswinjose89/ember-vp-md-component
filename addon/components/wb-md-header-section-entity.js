import Ember from 'ember';
import layout from '../templates/components/wb-md-header-section-entity';

export default Ember.Component.extend({
    layout,
    classNames: ['header-inline-top__left'],
    actions: {
        showToolTip(data) {
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: true
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        },
        goBack() {
            this.sendAction("goBackAction");
        }
    }
});