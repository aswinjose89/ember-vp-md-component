import Ember from 'ember';
import layout from '../../templates/components/table/column-filter';

//import mixin
import clickOutside from '../../mixins/click-outside';

export default Ember.Component.extend(clickOutside, {
    layout,
    isOpen: false,
    clickOutside() {
        this.toggleProperty('isOpen');
    }
});