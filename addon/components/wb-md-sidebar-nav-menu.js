import Ember from 'ember';
import layout from '../templates/components/wb-md-sidebar-nav-menu';

export default Ember.Component.extend({
    layout,
    classNames: ['sidebar-nav-form'],
    init() {
        this._super(...arguments);
        //@Deprecation
        Ember.Logger.error(`Deprecation: wb-md-sidebar-nav-additional-info is deprecated please use the new sidebar config`);
    }
});
