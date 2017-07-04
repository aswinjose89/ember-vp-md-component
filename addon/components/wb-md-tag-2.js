import Ember from 'ember';
import layout from '../templates/components/wb-md-tag-2';


//import mixins
import componentHelper from '../mixins/component-helper';

export default Ember.Component.extend(componentHelper, {
    layout,
    classNames: ['global-tag'],
    classNameBindings: [
        'setColor',
        'setBackground',
    ],
    label: null,
    size: 'normal',
    color: 'white',
    background: 'grey-500',
    //computed properties
    setColor: Ember.computed('color', {
        get() {
            let color = this.get('color');
            return this.setupClassNamesFromProperty('material_color_', color);
        }
    }),
    setBackground: Ember.computed('background', {
        get() {
            let background = this.get('background');
            return this.setupClassNamesFromProperty('material_background_', background);
        }
    }),
    circleStatusColor: Ember.computed('circle', {
        get() {
            let circle = this.get('circle');
            return this.setupClassNamesFromProperty('material_background_', circle);
        }
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    }
});