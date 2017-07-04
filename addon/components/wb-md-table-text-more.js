import Ember from 'ember';
import ComponentHelper from '../mixins/component-helper';
import layout from '../templates/components/wb-md-table-text-more';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['global-table__overflow'],
    enableResizeListener: true,
    isOverflowed: false,
    checkForHelpTextOverflow() {
        let element = this.get('element').querySelector('.global-table__overflow-element');
        if (element) {
            let overflow = element.offsetWidth < element.scrollWidth;
            this.set('isOverflowed', overflow);
        }
    },
    showEdit: Ember.computed('content', 'enableLinkAction', 'isReadOnly', function () {
        return this.get('enableLinkAction') && !Ember.isEmpty(this.get('content')) && !this.get('isReadOnly') && !this.get('isDisabled');
    }),
    didRender() {
        if (!this.get('isDestroying')) {
            Ember.tryInvoke(this, 'checkForHelpTextOverflow');
        }
    },
    actions: {
        showFullText(text) {
            if (this.get('enableLinkAction') && !this.get('isReadOnly') && !this.get('isDisabled')) {
                this.wbActionHandler('linkAction');
            } else {
                this.mdDialogManager.alert({
                    message: text,
                    title: this.get('popupHeader'),
                    showTopBar: true,
                    showActionBar: true,
                    buttonLabel: 'GOT IT'
                });
            }
        }
    }
});