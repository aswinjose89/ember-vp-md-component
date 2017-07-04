import Ember from 'ember';
import layout from '../templates/components/wb-md-checkbox-nested';

export default Ember.Component.extend({
    layout,
    tagName: '',
    isShowCheckBox: false,
    actions: {
        toggleIsShow(value){
            this.set('isShowCheckBox', value);
        }
    }
});
