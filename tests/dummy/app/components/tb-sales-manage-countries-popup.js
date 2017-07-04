import Ember from 'ember';
import layout from '../templates/components/tb-sales-manage-countries-popup';

export default Ember.Component.extend({
  layout,
  init(){
    this._super(...arguments);
    this.set('model', this.config.componentConfig.componentConfig.model);
  },
  actions:{
    closeDialog() {
        this.get('config.onClose').call(this.get('config.callbackContext'));
    }
  }
});
