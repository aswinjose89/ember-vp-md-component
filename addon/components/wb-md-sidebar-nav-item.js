import Ember from 'ember';
import layout from '../templates/components/wb-md-sidebar-nav-item';
import ComponentHelper from '../mixins/component-helper';

export default Ember.LinkComponent.extend(ComponentHelper, {
    layout,
    classNames: ['sidebar-nav-form-sections__element'],
    enableTracking: true,
    classNameBindings: [
        'isCompleted:sidebar-nav-form-sections__element_done',
        'isError:sidebar-nav-form-sections__element_error',
        'done:sidebar-nav-form-sections__element_done',
        'isDisabled:sidebar-nav-form-sections__element_disabled'
    ],
    activeClass: "sidebar-nav-form-sections__element_current",
    isCompleted: Ember.computed('status', function () {
        return this.get('status') === 'complete';
    }),
    isError: Ember.computed('status', function () {
        return this.get('status') === 'error';
    }),
    iconName: Ember.computed('status', function () {
        if (this.get('status') !== undefined) {
            return 'check';
        }
        return;
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