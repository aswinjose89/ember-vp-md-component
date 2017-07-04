import Ember from 'ember';
import layout from '../templates/components/wb-md-radio';
import truthConvert from 'wb-ui-md-components/utils/truth-convert';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['input-radio'],
    classNameBindings: ['isDisabled:input-radio_status_disabled'],
    isDisabled: Ember.computed('disabled', function () {
        let result=this.get('disabled');
        if(typeof result==='string'){
            return result.toLowerCase()==='true';
        }
        return truthConvert(result);
    }),
    didRender(){
        if(Ember.isPresent(this.get('element'))){
            this.addRippleEffect(this.get('element').querySelector('.input-radio__icon'));
        }
    },
    click() {
        if(this.get('element').querySelector('input').checked === false) {
            this.get('element').querySelector('input').checked = true;
            this.set('selection', this.get('value'));
            if(!Ember.isEmpty('changeSelection')){
                this.get('changeSelection')();
            }
        }
    },
    checked: Ember.computed('selection', {
        get: function get() {
            return this.get("value") === this.get("selection");
        }
    })
});
