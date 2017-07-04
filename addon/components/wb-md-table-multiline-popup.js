import Ember from 'ember';
import layout from '../templates/components/wb-md-table-multiline-popup';

export default Ember.Component.extend({
    layout,
    tagName: '',
    componentConfig: Ember.computed.reads('config.componentConfig'),
    isRequired: Ember.computed.reads('componentConfig.isRequired'),
    init() {
        this._super(...arguments);
        let record = this.get('componentConfig.record'),
            field = this.get('componentConfig.field');
        this.set('multiLineText', record.get(field));
    },
    isDoneDisabeld: Ember.computed('multiLineText', 'componentConfig.record.{componentConfig.field}', function () {
        let multiLineText = this.get('multiLineText');
        return this.get('isRequired') && !Ember.isPresent(multiLineText);
    }),
    popupTitle: Ember.computed('title', function () {
        return Ember.isPresent(this.get('title')) ? this.get('title') : `Add ${this.get('componentConfig.label')}`;
    }),
    actions: {
        saveContent() {
            let record = this.get('componentConfig.record'),
                field = this.get('componentConfig.field'),
                multiLineText = this.get('multiLineText');
            if (!Ember.isEmpty(multiLineText)) {
                multiLineText = multiLineText.trimRight();
            }
            record.set(field, multiLineText);
            this.send('closeDialog');
        },
        closeDialog() {
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        }
    }
});