import Ember from 'ember';
import layout from '../templates/components/tb-sales-countries';
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
    }
});
