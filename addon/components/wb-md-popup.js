import Ember from 'ember';
import layout from '../templates/components/wb-md-popup';

export default Ember.Component.extend({
    layout,
    classNames: ['global-popup'],
    size: '',
    classNameBindings: [
        'setType'
    ],
    modalSize: Ember.computed('size', function() {
        let size = this.get('size');
        if (size === 'medium') {
            return ' global-popup__wrapper_width_600';
        } else if (size === 'large') {
            return ' global-popup__wrapper_width_940';
        }
        return ' global-popup__wrapper';
    }),
    setType: Ember.computed('type', function() {
        let type = this.get('type');
        if (Ember.isEmpty(type)) {
            return;
        }
        return type;
    }),
    modalHeight: Ember.computed('height', function() {
        let height = this.get('height');
        if (Ember.isEmpty(height)) {
            return;
        }
        return ` global-popup_height_${height}`;
    })
});