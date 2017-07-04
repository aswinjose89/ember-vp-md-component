import Ember from 'ember';
import layout from '../templates/components/wb-md-spacer';

//import mixins
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['global-spacer'],
    classNameBindings: [
        'setSize'
    ],
    size: 'normal',
    setSize: Ember.computed('size', {
        get() {
            let size = this.get('size');
            return this.setupClassNamesFromProperty('global-spacer_size_', size);
        }
    }),
});