import Ember from 'ember';
import layout from '../templates/components/wb-md-header-section-toolbar-item';

const {
    computed
} = Ember;

export default Ember.Component.extend({
    layout,
    tagName: 'li',
    classNames: ['global-icon-toolbar__element'],
    //by default type will be icon
    type: 'icon',
    isIcon: computed('type', function () {
        return this.get('type') === 'icon' ? true : false;
    }),
    actions: {
        clickAction() {
            this.sendAction("clickAction", this.get('actionName'));
        }
    }
});
