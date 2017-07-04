import Ember from 'ember';
import layout from '../templates/components/wb-md-card-comment';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['card-comment'],
    classNameBindings: [
        'border:card-comment_border',
        'focused:card-comment_focused'
    ],
    value: null,
    editedValue: null,
    maxLength: 4000,
    showLength: 240,
    visibleLines: 3,
    readOnly: false,
    edit: false,
    counter: true,
    showFullText: false,
    submitNew: 'Add',
    submitEdit: 'Update',
    cancelNew: 'Cancel',
    cancelEdit: 'Cancel',
    focused: false,
    border: true,
    autofocus: false,
    actionMenu: Ember.Object.create({
        items: Ember.A([
            Ember.Object.create({
                label: "Edit",
                action: "edit",
                iconName: "edit"
            }),
            Ember.Object.create({
                label: "Delete",
                action: "openConfirmation",
                iconName: "delete"
            })
        ]),
        position: "right"
    }),
    //computed properties
    maxLengthFormatted: Ember.computed('maxLength', function () {
        let maxLength = this.get('maxLength');
        return this.formatTextCount(maxLength);
    }),
    valueLengthFormatted: Ember.computed('valueLength', {
        get() {
            let valueLength = this.get('valueLength');
            return this.formatTextCount(valueLength);
        }
    }),
    showTextCounter: Ember.computed('counter', 'maxLength', {
        get() {
            let counter = this.get('counter'),
                maxLength = this.get('maxLength'),
                showTextCounter = counter && !Ember.isEmpty(maxLength);
            return showTextCounter;
        }
    }),
    tabindex: Ember.computed('showComment', 'readOnly', {
        get() {
            let showComment = this.get('showComment'),
                readonly = this.get('readonly');
            if (showComment || readonly) {
                return -1;
            }
            return 1;
        }
    }),
    computedValue: Ember.computed('value', 'editedValue', {
        get() {
            let value = this.get('editedValue') || this.get('value');
            return value;
        },
        set() {
            let formValue = arguments[1];
            this.set('editedValue', formValue);
            return formValue;
        }
    }),
    computedCancelLabel: Ember.computed('edit', {
        get() {
            let edit = this.get('edit'),
                cancelNew = this.get('cancelNew'),
                cancelEdit = this.get('cancelEdit');
            if (edit) {
                return cancelEdit;
            }
            return cancelNew;
        }
    }),
    computedSubmitLabel: Ember.computed('edit', 'valueExist', {
        get() {
            let edit = this.get('edit'),
                submitNew = this.get('submitNew'),
                submitEdit = this.get('submitEdit'),
                valueExist = this.get('valueExist');
            if (valueExist) {
                return submitEdit;
            }
            return submitNew;
        }
    }),
    showMoreLabel: Ember.computed('showFullText', {
        get() {
            let showFullText = this.get('showFullText');
            if (showFullText) {
                return `Show less`;
            }
            return `Show More`;
        }
    }),
    valueEmpty: Ember.computed.empty('value'),
    valueExist: Ember.computed.not('valueEmpty'),
    computedValueEmpty: Ember.computed.empty('computedValue'),
    computedValueExist: Ember.computed.not('computedValueEmpty'),
    valueLength: Ember.computed('computedValue', {
        get() {
            let value = this.get('computedValue'),
                valueExist = this.get('computedValueExist'),
                valueLength = valueExist ? value.length : 0;
            return valueLength;
        }
    }),
    editable: Ember.computed.not('readOnly'),
    canShowForm: Ember.computed.or('valueEmpty', 'edit'),
    showForm: Ember.computed.and('editable', 'canShowForm'),
    showComment: Ember.computed.not('showForm'),
    notEdit: Ember.computed.not('edit'),
    disabledCancelButton: Ember.computed('value', 'computedValue', {
        get() {
            return Ember.isEmpty(this.get('value')) && Ember.isEmpty(this.get('computedValue'));
        }
    }),
    readValue: Ember.computed('value', 'valueEmpty', 'showFullText', {
        get() {
            let valueEmpty = this.get('valueEmpty'),
                value = this.get('value'),
                visibleLines = this.get('visibleLines'),
                showFullText = this.get('showFullText'),
                showLength = this.get('showLength'),
                showMore = this.get('showMore');
            if (valueEmpty) {
                return;
            }
            value = value.replace(/\r(?!\n)|\n(?!\r)/g, '<br/>');
            if (showMore && !showFullText) {
                value = `${value.substr(0, showLength - 3)} ...`;
                return value.substr(0, value.split('<br/>', visibleLines).join('<br/>').length);
            }
            return value;
        }
    }),
    emptyClosure: Ember.computed.empty('openCommentAction'),
    showMore: Ember.computed('showLength', 'valueLength', {
        get() {
            let isNewLinesExceeded, newLines,
                valueLength = this.get('valueLength'),
                visibleLines = this.get('visibleLines'),
                value = this.get('value'),
                showLength = this.get('showLength');
            try {
                newLines = value ? value.match(/\r(?!\n)|\n(?!\r)/g) : 0;
            } catch (error) {
                Ember.Logger.error('truncate helper: value is undefined', error);
            }
            if (Ember.isPresent(newLines) && Ember.isPresent(value) && newLines.length >= visibleLines) {
                isNewLinesExceeded = true;
            }
            return valueLength > showLength || isNewLinesExceeded;
        }
    }),
    showActionMenu: Ember.computed.and('editable', 'showTools'),
    //private actions
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    elasticHeight: Ember.on('didRender', function () {
        if (this.get('showForm')) {
            let textarea = this.get('element').querySelector('textarea');
            textarea.style.height = `auto`;
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }),
    focusTextArea() {
        let textarea = this.get('element').querySelector('textarea');
        if (textarea) {
            textarea.focus();
        }
    },
    onFocusIn: Ember.on('focusIn', function () {
        this.set('focused', true);
        this.focusTextArea();
    }),
    onFocusOut: Ember.on('focusOut', function () {
        this.set('focused', false);
    }),
    onMouseEnter: Ember.on('mouseEnter', function () {
        this.set('showTools', true);
    }),
    onMouseOut: Ember.on('mouseLeave', function () {
        this.set('showTools', false);
    }),
    autoFocusAfterRender: Ember.on('didInsertElement', function () {
        let showForm = this.get('showForm'),
            autofocus = this.get('autofocus');
        if (showForm && autofocus) {
            this.set('focused', true);
            this.focusTextArea();
        }
    }),
    actions: {
        truncateToMaxLength() {
            this.set('editedValue', this.handleMaxLength(this.get('editedValue')));
        },
        edit() {
            this.set('edit', true);
            Ember.run.scheduleOnce('afterRender', this, function () {
                this.focusTextArea();
            });
            this.wbActionHandler('editAction', [this.get('value'), this.get('elementId'), event]);
        },
        cancel() {
            this.set('editedValue', null);
            if (this.get('computedValue')) {
                this.set('edit', false);
            }
            if (this.get('valueEmpty')) {
                Ember.tryInvoke(this, 'openCommentAction', [this]);
            }
        },
        submit() {
            if (this.get('editedValue')) {
                this.set('value', this.get('editedValue'));
                this.set('editedValue', null);
            }
            this.set('edit', false);
            this.wbActionHandler('saveAction', [this.get('value'), this.get('elementId'), event]);
        },
        openConfirmation() {
            this.mdDialogManager.confirm({
                type: 'confirmation',
                cancelButtonLabel: 'Cancel',
                confirmButonLabel: 'Delete',
                title: 'Delete',
                message: `Do you want to delete this comment?`
            }).then(() => {
                this.set('edit', true);
                this.set('value', '');
                this.wbActionHandler('deleteAction', [this.get('value'), this.get('elementId'), event]);
            });
        }
    }
});