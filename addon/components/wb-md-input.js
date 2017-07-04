import Ember from 'ember';
import layout from '../templates/components/wb-md-input';
import ComponentHelper from '../mixins/component-helper';
import truthConvert from 'wb-ui-md-components/utils/truth-convert';
import scrollListener from '../mixins/scroll-listener';
import ClickOutside from '../mixins/click-outside';
import keyBoardEvents from '../mixins/key-board-events';
import DateComponent from '../classes/input/DateComponent';
import InputComponent from '../classes/input/InputComponent';
import SelectComponent from '../classes/input/SelectComponent';
import SearchComponent from '../classes/input/SearchInput';

const {
    computed,
    isEmpty
} = Ember;

export default Ember.Component.extend(ComponentHelper, ClickOutside, scrollListener, keyBoardEvents, {
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        this.reopen(InputComponent);
        this.initInput();
        //TODO refractor
        if (this.get('isValid')) {
            this.set(this.get('isValid'), this.get('isValid'));
        }
        this.initializeInputComponent();
    },
    searchable: Ember.computed.bool('multiple'),
    debounceTime: 500,
    showDays: true,
    maxSelection: 0,
    disableDecimal: false,
    enableScrollListener: true,
    enableSearchAcross: false,
    resultType: null,
    minimumInputLength: Ember.computed('remoteSearch', function () {
        return this.get('remoteSearch') ? 3 : 0;
    }),
    hiddenItems: 0,
    loading: false,
    resolved: false,
    numberFormatRegion: 'en-UK',
    minSelection: '',
    tableConfig: Ember.computed(function () { return Ember.Object.create(); }),
    filteredContent: Ember.computed(function () { return Ember.A(); }),
    selectedItem: null,
    emptyContentMessage: 'No data available',
    rejected: false,
    isCheckBoxSelection: Ember.computed.bool('multiLevel'),
    optionValuePath: null,
    optionLabelPath: null,
    remoteSearch: false,
    searchAction: null,
    isNegative: false,
    loadingMessage: 'Loading...',
    maxSelectionMessage: Ember.computed('isMaxSelectionReached', function () {
        return `Only ${this.get('maxSelection')} selections are allowed`;
    }),
    selectedItems: Ember.computed(function () { return Ember.A(); }),
    isCollapsed: false,
    isOpen: false,
    layout: layout,
    type: 'text',
    pagable: false,
    pageable: Ember.computed.alias('pagable'),
    pageSize: 20,
    searchKey: '',
    page: 1,
    textCount: 0,
    classNameBindings: ['isActive:input-row_status_active',
        'isSearchActive:input-search_status_active',
        'setColor',
        'isShadowed:input-search_status_shadowed',
        'isOpen:input-row_status_active',
        'isBlock',
        'isError:input-row_status_error',
        'isFilled:input-row_status_filled',
        'isDisabled:input-row_status_disabled',
        'isSelected:input-row_status_selected',
        'isInbox:input-row_inbox',
        'isReadOnly:input-row_status_readonly'
    ],
    outSideComponent: '.input-row__inline',
    isFilled: computed('value', 'selectedItem', 'searchKey', function () {
        if (this.get('isSelect')) {
            if (this.get('searchable')) {
                return Ember.isPresent(this.get('searchKey'));
            } else {
                return this.isSelectedItemPresent(this.get('selectedItem'), this.get('optionValuePath'));
            }
        }
        let value = this.get('value'),
            textCount = 0;
        if (Ember.isPresent(value)) {
            if (this.get('type') === 'number') {
                value = value.toString();
            }
            textCount = Ember.get(value, 'length');
        } else if (this.get('isFormatted')) {
            this.set('formattedValue', value);
            this.validate();
        }
        this.set('textCount', textCount);
        return !isEmpty(this.get('value'));
    }),
    isLoadMoreRecords: Ember.computed('totalRecords', 'filteredContent.[]', function () {
        return this.get('totalRecords') !== this.get('filteredContent.length');
    }),
    showHideText: computed('isCollapsed', function () {
        return this.get('isCollapsed') ? 'Hide' : 'Show';
    }),
    setColor: Ember.computed('color', function () {
        if (!Ember.isEmpty(this.get('color')) && this.get('isSearch')) {
            return 'input-search_color_' + this.get('color');
        }
        return false;
    }),
    isSelected: Ember.computed('selectedItem', 'selectedItems.[]', function () {
        if (this.get('multiple')) {
            return !Ember.isEmpty(this.get('selectedItems'));
        } else if (this.get('searchable')) {
            return this.isSelectedItemPresent(this.get('selectedItem'), this.get('optionValuePath'));
        }
        return;
    }),
    searchFailedMessage: Ember.computed('rejected', function () {
        if (this.get('rejected')) {
            return 'Error retrieving data';
        }
        return;
    }),
    displayShowHideButton: false,
    noMatchesMessage: Ember.computed('resolved', function () {
        if (this.get('resolved') && Ember.isEmpty(this.get('filteredContent'))) {
            return 'No data available';
        }
        return;
    }),
    inputType: Ember.computed('type', function () {
        return (this.get('type') === 'password') ? this.get('type') : 'text';
    }),
    searchMessage: Ember.computed('minimumInputLength', function () {
        return `Type minimum ${this.get('minimumInputLength')} to search`;
    }),
    elementClass: computed('block', function () {
        return this.get('block') ? 'subject' : 'row';
    }),
    isBlock: computed('block', function () {
        if (this.get('isSearch')) {
            return;
        }
        return this.get('block') ? 'input-subject' : 'input-row';
    }),
    isError: computed('errorMessage', 'componentErrorMessage', function () {
        let isError = (Ember.isPresent(this.get('errorMessage')) || Ember.isPresent(this.get('componentErrorMessage')));
        if (isError || (this.get('required') && this.get('isFilled'))) {
            this.sendAction('isValid', !isError, this.get('id'));
        }
        return isError;
    }),
    isDisabled: Ember.computed('disabled', function () {
        let result = this.get('disabled');
        if (this.get('disabled')) {
            this.set('componentErrorMessage', '');
        }
        if (typeof result === 'string') {
            return result.toLowerCase() === 'true';
        }
        return truthConvert(result);
    }),
    isReadOnly: Ember.computed('readonly', function () {
        let result = this.get('readonly');
        if (typeof result === 'string') {
            return result.toLowerCase() === 'true';
        }
        return truthConvert(result);
    }),
    didRequiredValidationChanged: Ember.observer('required', function () {
        if (!this.get('required')) {
            this.set('componentErrorMessage', '');
        }
    }),
    componentErrorMessage: '',
    requiredErrorMessage: 'This is a required field',
    computedErrorMessage: Ember.computed('isError', {
        get() {
            return Ember.isPresent(this.get('componentErrorMessage')) ? this.get('componentErrorMessage') : this.get('errorMessage');
        }
    }),
    isMaxSelectionReached: Ember.computed('maxSelection', 'selectedItems.@each', function () {
        if (this.get('maxSelection') === 0) {
            return false;
        }
        return (this.get('multiple') && this.get('selectedItems.length') >= this.get('maxSelection'));
    }),
    searchKeyMaxLength: Ember.computed('maxLength', 'selectedItems.[]', 'searchKey', function () {
        if (Ember.isEmpty(this.get('selectedItems'))) {
            return this.get('maxLength');
        }
        let selectItemsLength = this.get('selectedItems').mapBy(this.get('optionLabelPath')).join();
        return this.get('maxLength') - selectItemsLength.length;
    }),
    maxLengthFormatted: Ember.computed('maxLength', function () {
        let maxLength = this.get('maxLength');
        return this.formatTextCount(maxLength);
    }),
    textCountFormatted: Ember.computed('textCount', {
        get() {
            let textCount = this.get('textCount');
            return this.formatTextCount(textCount);
        }
    }),
    formattedMemberList: Ember.computed('filteredContent.[]', 'filteredContent.@each', 'isMemberDropdown', 'hasGroups', {
        get() {
            let isMemberDropdown = this.get('isMemberDropdown'),
                hasGroups = this.get('hasGroups'),
                content = this.get('filteredContent');
            if (isMemberDropdown && hasGroups) {
                let newArray = Ember.A();
                content.forEach(item => {
                    let header = Ember.Object.create({
                            isGroupHeader: true,
                            groupName: Ember.get(item, this.get('config.resultConfig.groupHeader'))
                        }),
                        list = Ember.A(Ember.get(item, this.get('config.resultConfig.members')));
                    newArray.pushObject(header);
                    if (list.get('length')) {
                        list.forEach(item => {
                            newArray.pushObject(item);
                        });
                    }
                });
                return newArray;
            } else {
                return content;
            }
        }
    }),
    invokeFocusIn: Ember.on('focusIn', function () {
        if (this.get('isDisabled') || this.get('isReadOnly') || (event && event.srcElement.tagName === 'A')) {
            Ember.tryInvoke(this, 'clickOutside');
            return;
        } else if (this.get('isSelect') && !this.get('isOpen')) {
            this.set('isOpen', true);
        }
        Ember.run.next(this, function () {
            this.wbActionHandler('onFocusIn', [this.get('label'), this.get('value'), this.get('elementId'), event]);
        });
    }),
    invokeFocusOut: Ember.on('focusOut', function () {
        Ember.run.next(this, function () {
            this.wbActionHandler('onFocusOut', [this.get('label'), this.get('value'), this.get('elementId'), event]);
        });
    }),
    initializeInputComponent() {
        this.setDefaults();
        switch (this.get('type')) {
            case 'datepicker':
                this.reopen(DateComponent);
                this.initDate();
                break;
            case 'select':
                this.reopen(SelectComponent);
                this.initSelect();
                break;
            case 'search':
                this.reopen(SearchComponent);
                if (Ember.isEmpty(this.get('isShadowed'))) {
                    this.set('isShadowed', true);
                }
                break;
            default:
        }
    },
    didRender() {
        this._super(...arguments);
    },
    setDefaults() {
        if (!Ember.isEmpty(this.get('label'))) {
            this.set('placeholder', null);
        }
        if (Ember.isEmpty(this.get("value"))) {
            this.set("value", "");
        }
    },
    checkForHelpTextOverflow() {
        let element = this.get('element').querySelector('.input-row__description .global-overflow__fluid');
        if (element) {
            let overflow = element.offsetWidth < element.scrollWidth;
            this.set('helpTextIsTruncated', overflow);
        }
    },
    actions: {
        showToolTip(data) {
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: true
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        },
        triggerEnterAction() {
            this.wbActionHandler('enterAction');
        },
        showFullHelpText() {

        },
        openHelpModal(message, event) {
            event.stopPropagation();
            this.mdDialogManager.alert({
                message: message,
                title: 'Information',
                showTopBar: false,
                showActionBar: false,
                buttonLabel: 'GOT IT',
                size: 'medium'
            });
        },
        bottomLineClick() {}
    }
});