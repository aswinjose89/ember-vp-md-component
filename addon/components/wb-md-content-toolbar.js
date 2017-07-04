import Ember from 'ember';
import layout from '../templates/components/wb-md-content-toolbar';
import componentHelper from '../mixins/component-helper';

export default Ember.Component.extend(componentHelper, {
    classNames: ['content-toolbar'],
    classNameBindings: [
        'contentToolbarBorder',
        'contentToolbarColor',
        'contentToolbarPosition',
        'contentToolbarPad',
        'contentToolbarHeight',
        'contentToolbarVertical',
        'contentToolbarhighlight',
        'isShadowed'
    ],
    contentToolbarBorder: Ember.computed('border', function () {
        if (!Ember.isEmpty(this.get('border'))) {
            return `content-toolbar_border_${this.get('border')}`;
        }
    }),
    contentToolbarColor: Ember.computed('color', function () {
        if (!Ember.isEmpty(this.get('color'))) {
            return `content-toolbar_color_${this.get('color')}`;
        }
    }),
    contentToolbarPosition: Ember.computed('position', function () {
        if (!Ember.isEmpty(this.get('position'))) {
            return `content-toolbar_position_${this.get('position')}`;
        }
    }),
    contentToolbarVertical: Ember.computed('vertical', function () {
        if (!Ember.isEmpty(this.get('vertical'))) {
            return `content-toolbar_vertical_${this.get('vertical')}`;
        }
    }),
    contentToolbarPad: Ember.computed('pad', {
        get() {
            return this.setupClassNamesFromProperty('content-toolbar_pad_', this.get('pad'));
        }
    }),
    contentToolbarhighlight: Ember.computed('highlight', {
        get() {
            return this.setupClassNamesFromProperty('content-toolbar_highlight_', this.get('highlight'));
        }
    }),
    isShadowed: Ember.computed('shadow', {
        get() {
            if (this.get('shadow')) {
                return 'content-toolbar_shadow';
            }
            return;
        }
    }),
    contentToolbarHeight: Ember.computed('height', function () {
        if (!Ember.isEmpty(this.get('height'))) {
            return `content-toolbar_height_${this.get('height')}`;
        }
    })
});