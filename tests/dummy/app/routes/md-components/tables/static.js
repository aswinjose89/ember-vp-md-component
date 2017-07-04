import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let filters = JSON.stringify({
            pagination: {
                page: 1,
                size: 5
            }
        });
        return this.get('store').query('user', {
            filters
        });
    },
    setupController(controller) {
        this._super(...arguments);
        controller.set('selectedUser', {});
        controller.set('userSelectionConfig', Ember.Object.create({
            type: "select",
            content: this.controller.get('model'),
            label: 'Select User to edit',
            optionLabelPath: 'psId'
        }));
        controller.set('staticTableConfig', this.getTableConfig());
        let emptyTableConfig = this.getTableConfig();
        emptyTableConfig.content = null;
        controller.set('emptyTableConfig', emptyTableConfig);
        controller.set('emptyPageableTableConfig', this.getPageableTableConfig());
    },
    getTableConfig() {
        return {
            tableHeading: 'User Table',
            content: this.currentModel,
            columns: [{
                field: 'psId',
                type: 'text',
                title: 'PSID',
                helpText: "User's ID",
                helpTextAction: 'helpAction'
            }, {
                field: 'fullName',
                type: 'text',
                isPriorityWidth: true,
                title: 'Computed Full Name',
                helpText: "User's computed first and last name"
            }, {
                field: 'lastName',
                type: 'text',
                title: 'Last Name',
                isPriorityWidth: true,
                helpText: "User's Last Name"
            }, {
                field: 'emailId',
                horizontalAlignment: 'right',
                type: 'text',
                title: 'Email Id',
                helpText: "User's Email"
            }, {
                field: 'userCountry',
                type: 'text',
                title: 'User Country',
                helpText: "User's Country"
            }]
        };
    },
    getPageableTableConfig() {
        return {
            tableHeading: 'User table from remote API',
            pageable: true,
            pageType: 'loadmore',
            sortable: true,
            priorityColumns: true,
            rowAction: {
                iconName: "remove_circle",
                action: 'deleteAction'
            },
            headerToolBar: {
                enableTableSearch: true,
                tableSearchTooltip: 'Find Clients',
                enableShowHideColumn: true,
                downloadAction: 'downloadAction',
                downloadTooltip: 'Export'
            },
            minColumnCount: 3,
            filterConditions: ['contains', 'equal'],
            content: this.get('tableContent'),
            columns: [{
                field: 'psId',
                type: 'text',
                title: 'PSID'
            }, {
                field: 'firstName',
                isPriorityWidth: true,
                type: 'text',
                title: 'First Name'
            }, {
                field: 'lastName',
                type: 'text',
                title: 'Last Name'
            }, {
                field: 'createdDate',
                type: 'date',
                filterType: 'date',
                filterConfig: Ember.Object.create({
                    enableCentralizedTimeZone: true
                }),
                title: 'Created Date'
            }, {
                field: 'emailId',
                type: 'text',
                title: 'Email Id'
            }, {
                field: 'nationalities',
                type: 'array',
                arrayLabelPath: 'name',
                title: 'Nationalities',
            }, {
                field: 'userCountry',
                type: 'text',
                title: 'User Country'
            }, {
                field: 'jobTitle',
                type: 'boolean',
                title: 'Job Title'
            }, {
                field: 'department',
                type: 'text',
                title: 'Department'
            }]
        };
    },
    actions: {
        helpAction() {
            this.mdDialogManager.alert({
                message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                title: 'Lorem Ipsum',
                showTopBar: true,
                showActionBar: true,
                buttonLabel: 'OK'
            });
            Ember.Logger.log('help action invoked', ...arguments);
        }
    }
});