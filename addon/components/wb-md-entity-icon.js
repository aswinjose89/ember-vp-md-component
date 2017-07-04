import Ember from 'ember';
import layout from '../templates/components/wb-md-entity-icon';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['entity-icon'],
    classNameBindings: [
        'setSize',
        'setColor',
        'isNumber:entity-icon_number'
    ],
    init(){
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    setSize: Ember.computed('size', function () {
        if (!Ember.isEmpty(this.get('size'))) {
            return 'entity-icon_size_' + this.get('size');
        }
        return false;
    }),
    setColor: Ember.computed('color', function () {
        if (!Ember.isEmpty(this.get('color'))) {
            return 'entity-icon_color_' + this.get('color');
        }
        return false;
    }),
    isNumber: Ember.computed('value', function () {
        if (!Ember.isEmpty(this.get('value'))) {
            return !isNaN(this.get('value'));
        }
        return false;
    })
});
