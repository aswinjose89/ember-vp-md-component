import Ember from 'ember';
import layout from '../templates/components/editable-table-addtional-input';

export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    totalMargin: Ember.computed('users.@each.margin', function () {
        /* jshint undef:false */
        let total = this.get('users').reduce(function (initial, current) {
            current = (isNaN(current.get('margin')) || Ember.isEmpty(current.get('margin'))) ? 0 : current.get('margin');
            return parseFloat(initial) + parseFloat(current);
        }, 0);
        return isNaN(total) ? 0 : (new Intl.NumberFormat('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(total));
    }),
    init() {
        this._super(...arguments);
        this.set('editableNumericTableConfig', this.getEditableNumericTableConfig());
    },
    actions: {
        addANewUser() {
            this.get('users').addObject(Ember.Object.create({}));
        },
        onFocusIn(user) {
            Ember.Logger.log('onFocusIn', ...arguments);
            if (Ember.isPresent(user) && Ember.typeOf(user) === 'instance') {
                user.set('focused', true);
            }
        },
        onFocusOut(user) {
            Ember.Logger.log('onFocusOut', ...arguments);
            if (Ember.isPresent(user) && Ember.typeOf(user) === 'instance') {
                console.log('Valid user?', user.get('errors'));
            }
        },
        getNewCountries(searchValue) {
            Ember.Logger.log('zzz getNewCountries', ...arguments);
            return this.get('store').query('country', { searchValue: searchValue });
        },
    },
    getEditableNumericTableConfig() {
        let countries = this.get('countries').toArray();
        return {
            tableHeading: 'Additonal Input Types',
            type: 'editable',
            content: this.get('users'),
            enableAddRow: true,
            rowAction: {
                isHiddenField: 'isReadOnly',
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            addNewRowAction: 'addANewUser',
            columns: [{
                field: 'psId',
                type: 'number',
                disableDecimal: true,
                title: 'PSID',
                maxLength: 6
            }, {
                field: 'margin',
                type: 'number',
                isFormatted: true,
                isNegative: true,
                focusIn: 'onFocusIn',
                focusOut: 'onFocusOut',
                isBordered: 'true',
                maxValue: 9999,
                precision: 2,
                maxLength: 8,
                precisionField: 'customPrecison',
                title: 'Margin'
            }, {
                field: 'country',
                type: 'text',
                isSelect: true,
                isSearchable: true,
                enableRemoteSearch: true,
                placeholder: 'Select Country',
                iconName: 'arrow_drop_down',
                content: countries,
                optionLabelPath: 'name',
                title: 'Country',
                isPriorityWidth: true
            }, {
                field: 'description',
                type: 'text',
                isMultiLine: true,
                maxLength: 100,
                linkText: 'Add Description',
                title: 'Description',
                // isRequiredField: 'isRequired',
                isRequired: true,
                isPriorityWidth: true
            }]
        };
    }
});