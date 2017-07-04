import Ember from 'ember';
import layout from '../templates/components/wb-md-action-indicator';

//import mixins
import componentHelper from '../mixins/component-helper';

export default Ember.Component.extend(componentHelper, {
    layout,
    value: null,
    classNames: ['action-indicator'],
    classNameBindings: [
        'setColor'
    ],
    //computed properties
    setColor: Ember.computed('color', {
        get() {
            let color = this.get('color');
            return this.setupClassNamesFromProperty('material_color_', color);
        }
    })
});