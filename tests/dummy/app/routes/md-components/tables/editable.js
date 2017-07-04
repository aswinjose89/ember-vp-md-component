import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let filters = JSON.stringify({
            pagination: {
                page: 1,
                size: 5
            }
        });
        return Ember.RSVP.hash({
            users: this.get('store').query('user', { filters }),
            countries: this.get('store').query('country', {
                filters: JSON.stringify({
                    page: 1,
                    size: 100
                })
            })
        });
    },
    setupController(controller) {
        this._super(...arguments);
        controller.set('editableTableConfig', this.getEditableTableConfig());
    },
    actions: {
        deleteAction(content) {
            Ember.Logger.log('deleteAction Called in Route', content);
            this.get('tableContent').removeObject(content);
        },
        toggleFirstRow() {
            this.controller.get('model.users.firstObject').toggleProperty('isDisabled');

        },
        toggleFirstName() {
            let user = this.controller.get('model.users').findBy('id', '2');
            if (Ember.isPresent(user)) {
                user.toggleProperty('disableFirstName');
            }
        },
        triggerSearch(columName, record, searchValue) {
            Ember.Logger.log('Search Called', searchValue, columName, record);
            let tableConfig = this.controller.get('editableTableConfig');
            let column = Ember.A(tableConfig.columns).findBy('field', columName);
            if (searchValue !== '111') {
                Ember.set(column, 'content', Ember.A([
                    Ember.Object.create({
                        id: 1,
                        label: '123456'
                    }),
                    Ember.Object.create({
                        id: 2,
                        label: '123457'
                    }),
                    Ember.Object.create({
                        id: 3,
                        label: '123458'
                    })
                ]));
                return;
            } else {
                Ember.set(column, 'content', []);
            }
        },
        triggerEnter(columName, record, searchValue) {
            Ember.Logger.log('Enter Called', searchValue, columName, record);
            let tableConfig = this.controller.get('editableTableConfig'),
                column = Ember.A(tableConfig.columns).findBy('field', columName);
            Ember.set(column, 'content', Ember.A([
                Ember.Object.create({
                    id: 1,
                    label: searchValue
                }),
            ]));
        },
        editAction() {
            Ember.Logger.log('editAction Called in Route', ...arguments);
        },
        newRowAdded() {
            Ember.Logger.log('newRowAdded Called in Route', this.get('controller.newUsers'));
        },
        addANewUser() {
            Ember.Logger.log('Add new user called');
            let newUser = this.get('store').createRecord('user');
            this.get('tableContent').pushObject(newUser);
        },
        changeDropDown() {
            let tableContent = this.get('tableContent');
            let record = tableContent.findBy('id', '2');
            if (Ember.isPresent(record)) {
                record.get('customContent').clear();
            }
        },
        onFocusIn() {
            Ember.Logger.log('onFocusIn', ...arguments);
        },
        onFocusOut() {
            Ember.Logger.log('onFocusOut', ...arguments);
        },
        dateChanged() {
            Ember.Logger.log('dateChanged', ...arguments);
        },
        dateCleared() {
            Ember.Logger.log('dateCleared', ...arguments);
        }
    },
    getEditableTableConfig() {
        let tableContent = this.controller.get('model').users.toArray();
        let countries = this.controller.get('model').countries.toArray();
        this.set('tableContent', tableContent);
        return {
            tableHeading: 'User Table',
            type: 'editable',
            enableAddRow: true,
            hasErrorField: 'hasErrors',
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            addNewRowAction: 'addANewUser',
            content: tableContent,
            columns: [{
                field: 'user',
                type: 'number',
                isSearchable: true,
                disableDecimal: true,
                title: 'PSID',
                isMandatory: true,
                maxLength: 6,
                focusIn: 'onFocusIn',
                focusOut: 'onFocusOut',
                placeholder: 'Enter PSID',
                searchAction: 'triggerSearch',
                enterAction: 'triggerEnter',
                isPriorityWidth: true,
                searchMessage: 'Press enter to add the PSID'
            }, {
                field: 'createdDate',
                type: 'date',
                showDays: false,
                leftIconName: 'alarm',
                leftIconColor: 'green-500',
                clearDateAction: 'dateCleared',
                leftIconAction: 'editAction',
                leftIconHelpText: 'Event',
                iconName: 'arrow_drop_down',
                placeholder: 'Pick Date',
                title: 'Created Date',
                action: 'dateChanged',
                isPriorityWidth: true
            }, {
                field: 'firstName',
                type: 'text',
                maxLength: 10,
                placeholder: 'Enter First Name',
                focusIn: 'onFocusIn',
                focusOut: 'onFocusOut',
                title: 'First Name',
                disableField: 'disableFirstName',
                isPriorityWidth: true
            }, {
                field: 'country',
                type: 'text',
                isSelect: true,
                iconName: 'arrow_drop_down',
                content: countries,
                rightIconName: 'contacts',
                rightIconColor: 'blue',
                rightIconHelpText: 'Contacts',
                rightIconAction: 'editAction',
                contentValuePath: 'customContent',
                optionLabelPath: 'name',
                placeholder: 'Select Country',
                disableResetSelection: true,
                title: 'Custom Content',
                isPriorityWidth: true
            }, {
                field: 'nationalities',
                type: 'text',
                isSelect: true,
                multiSelect: true,
                maxSelection: 3,
                action: 'editAction',
                placeholder: 'Select Nationality',
                iconName: 'arrow_drop_down',
                content: countries,
                optionLabelPath: 'name',
                title: 'Nationalities',
                isPriorityWidth: true
            }, {
                field: 'country',
                type: 'text',
                isSelect: true,
                isSearchable: true,
                placeholder: 'Select Country',
                iconName: 'arrow_drop_down',
                content: countries,
                optionLabelPath: 'name',
                title: 'Country',
                isPriorityWidth: true
            }]
        };
    }
});