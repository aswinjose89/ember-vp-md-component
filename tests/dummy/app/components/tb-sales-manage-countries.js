import Ember from 'ember';
import layout from '../templates/components/tb-sales-manage-countries';
const {computed, K} = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};

export default Ember.Component.extend({
    layout,
    classNames: ['tb-sales-countries'],
    elementWidth: null,
    init(){
        this._super(...arguments);
        Ember.run.scheduleOnce('afterRender', this, ()=>{
            this.widthCalc();
        });
        window.addEventListener('resize', this.get('widthCalcHandler'));
    },
    widthCalcHandler: bound('widthCalc'),
    widthCalc(){
        let elWidth = this.get('element').clientWidth;
        this.set('elementWidth', elWidth);
    },
    didInsertElement(){
        window.addEventListener('resize', this.get('widthCalcHandler'));
    },
    willDestroyElement(){
        window.removeEventListener('resize', this.get('widthCalcHandler'));
    },
    actions:{
        addPresenceCountry(country){
            this.get('model.scbPresenceCountries').addObject(country);
            this.get('model.pendingCountries').removeObject(country);
        },
        addNonPresenceCountry(country){
            this.get('model.scbNonPresenceCountries').addObject(country);
            this.get('model.pendingCountries').removeObject(country);
        },
        removePresenceCountry(country){
            this.get('model.scbPresenceCountries').removeObject(country);
            this.get('model.pendingCountries').addObject(country);
        },
        removeNonPresenceCountry(country){
            this.get('model.scbNonPresenceCountries').removeObject(country);
            this.get('model.pendingCountries').addObject(country);
        }
    }
});
