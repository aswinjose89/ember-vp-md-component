import Ember from 'ember';
import layout from '../templates/components/wb-md-sidebar-nav-menu-item';

export default Ember.LinkComponent.extend({
    layout,
    classNames: ['sidebar-nav-form-sections__element'],
    status: null,
    iconName: 'check',
    activeClass: "sidebar-nav-form-sections__element_current",
    init() {
        this._super(...arguments);
        this.set('prevStatus', this.get('status'));
        this.get('attributeBindings').push('status');
        //@Deprecation
        Ember.Logger.error(`Deprecation: wb-md-sidebar-nav-menu-item is deprecated please use the new sidebar config`);
    },
    classNameBindings: [
        'isError:sidebar-nav-form-sections__element_error',
        'isCompleted:sidebar-nav-form-sections__element_done'
    ],
    isCompleted: Ember.computed('status', function () {
        return this.get('status') === 'complete';
    }),
    isError: Ember.computed('status', function () {
        return this.get('status') === 'error';
    }),
    iconStatusColor: Ember.computed('status', 'iconColor', 'active', function () {
        let iconColor = this.get('iconColor');
        if (this.get('isCompleted')) {
            iconColor = 'green-500';
        }
        if (this.get('isError')) {
            iconColor = 'red-500';
        }
        if (this.get('active')) {
            iconColor = 'white';
        }
        return iconColor;
    })
});