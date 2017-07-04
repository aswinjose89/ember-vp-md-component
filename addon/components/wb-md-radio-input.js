import Ember from 'ember';
import wbRadio from 'wb-ui-components/components/wb-radio-input';
import ComponentHelper from '../mixins/component-helper';

export default wbRadio.extend(ComponentHelper, {
    click : function () {
        this.set('selection', this.get('value'));
        return false;
    },
    didRender(){
        this._super(...arguments);
        if(Ember.isPresent(this.get('element'))){
            this.addRippleEffect(this.get('element').nextElementSibling);
        }
    }
});
