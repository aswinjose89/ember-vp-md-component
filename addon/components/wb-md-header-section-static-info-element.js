import Ember from 'ember';
import layout from '../templates/components/wb-md-header-section-static-info-element';

export default Ember.Component.extend({
    layout,
    classNames: ['entity-static-info__element'],
    init(){
      this._super(...arguments);
        this.deprecationWarning();
    },
    didInsertElement(){
        if (Ember.isEmpty(this.get('value'))) {
            this.set('value', '-');
        }
    },
    deprecationWarning() {
        if (!Ember.isEmpty(this.get('text'))) {
            //@Deprecation
            Ember.Logger.error(`Deprecation: Use wb-md-static-info instead.`);
        }
    }
});
