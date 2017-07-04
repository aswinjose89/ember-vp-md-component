import Ember from 'ember';
import layout from '../templates/components/wb-md-input-list';

export default Ember.Component.extend({
    layout,
    classNames: ['input-list'],
    isInline: false,
    classNameBindings: [
        'isInline:input-list_inline',
        'isError:input-list_status_error'
    ]
});