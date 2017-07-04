import Ember from 'ember';
import layout from '../templates/components/wb-md-entity-tag';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['entity-tag'],
    classNameBindings: [
        'setColor',
        'group:entity-tags-group',
        'single:entity-tag'
    ],
    color: 'white',
    background: 'indigo-900',
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
    group: Ember.computed.notEmpty('tags'),
    single: Ember.computed.not('group'),
    setColor: Ember.computed('color', {
        get() {
            let color = this.get('color');
            return this.setupClassNamesFromProperty('material_color_', color);
        }
    })
});