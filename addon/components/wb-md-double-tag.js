import Ember from 'ember';
import layout from '../templates/components/wb-md-double-tag';

//import mods
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['double-tag'],
    classNameBindings: [
        'setBackground',
        'setColor'
    ],
    color: 'white',
    background: 'grey-400',
    leftLabel: null,
    rightLabel: null,
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    setBackground: Ember.computed('background', {
        get() {
            let background = this.get('background');
            return this.setupClassNamesFromProperty('material_background_', background);
        }
    }),
    setColor: Ember.computed('color', {
        get() {
            let color = this.get('color');
            return this.setupClassNamesFromProperty('material_color_', color);
        }
    }),
    setRightColor: Ember.computed('background', {
        get() {
            let color = this.get('background');
            return this.setupClassNamesFromProperty('material_color_', color);
        }
    })
});