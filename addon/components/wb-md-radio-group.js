import Ember from 'ember';
import layout from '../templates/components/wb-md-radio-group';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    isInline: false,
    optionLabelPath: 'name',
    optionValuePath: 'value',
    isDrepcatedSelectedItem: false,
    classNames: ['input-list'],
    classNameBindings: [
        'isInline:input-list_inline',
        'isError:input-list_status_error'
    ],
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        let selectedItem = this.get('selectedItem'),
            value = this.get('value');

        if (Ember.isPresent(value)) {
            this.setSelectedItemFromValue(value);
        } else if (Ember.isPresent(selectedItem) && ['instance', 'object'].includes(Ember.typeOf(selectedItem))) {
            this.set('value', Ember.get(selectedItem, this.get('optionValuePath')));
        }

    },
    checkTextOverflow: Ember.on('didRender', function () {
        let errorMessageElement = this.get('element').querySelector('.input-list__error-message .global-overflow__fluid'),
            helpTextElement = this.get('element').querySelector('.input-list__description .global-overflow__fluid');
        if (Ember.isPresent(errorMessageElement)) {
            let overflow = errorMessageElement.offsetWidth < errorMessageElement.scrollWidth;
            this.set('isErrorTextOverflow', overflow);
        }
        if (Ember.isPresent(helpTextElement)) {
            let overflow = helpTextElement.offsetWidth < helpTextElement.scrollWidth;
            this.set('isHelpTextOverflow', overflow);
        }
    }),
    errorModalTitle: 'Warning',
    modalTitle: Ember.computed('helpModalTitle', function () {
        let helpModalTitle = this.get('helpModalTitle');
        return Ember.isPresent(helpModalTitle) ? helpModalTitle : 'Information';
    }),
    isError: Ember.computed('content.@each.isError', function () {
        let errorItems = Ember.A(this.get('content')).filterBy('isError', true);
        return errorItems.length > 0 ? true : false;
    }),
    selectedItemChanged: Ember.observer('selectedItem', function () {
        let selectedItem = this.get('selectedItem');

        if (Ember.isPresent(selectedItem) && ['instance', 'object'].includes(Ember.typeOf(selectedItem))) {
            this.set('value', Ember.get(selectedItem, this.get('optionValuePath')));
        }
    }),
    valueChanged: Ember.observer('value', function () {
        let value = this.get('value');

        this.setSelectedItemFromValue(value);

        Ember.run.next(this, function () {
            Ember.tryInvoke(this, 'onChange', [this.get("value"), this.get('selectedItem'), this.get("element")]);
        });
    }),
    computedHelpLinkTitle: Ember.computed('helpLinkTitle', {
        get() {
            return Ember.isPresent(this.get('helpLinkTitle')) ? this.get('helpLinkTitle') : 'Help';
        }
    }),
    setSelectedItemFromValue(value) {
        let content = Ember.A(this.get('content')),
            selectedItem;
        if (Ember.isPresent(content)) {
            selectedItem = content.findBy(this.get('optionValuePath'), value);
        }
        this.set('selectedItem', selectedItem);
    },
    actions: {
        setSelection(value) {
            this.set('value', value);
        },
        openHelpModal(message, isError) {
            let modelTitle = (isError) ? this.get('errorModalTitle') : this.get('modalTitle');
            this.mdDialogManager.alert({
                message: message,
                title: modelTitle,
                showTopBar: true,
                showActionBar: true,
                buttonLabel: 'GOT IT'
            });
        }
    }
});