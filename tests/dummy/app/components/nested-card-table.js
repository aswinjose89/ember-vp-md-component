import Ember from 'ember';
import layout from '../templates/components/nested-card-table';

export default Ember.Component.extend({
    layout,
    init() {
        this._super(...arguments);
        this.set('nestedCardTableConfig', this.getTableConfig());
    },
    tableContent: Ember.A([
        Ember.Object.create({
            idType: 'Passport',
            id: 11,
            idNumber: 'XYZKJH',
            componentConfig: {
                productValue: 'Import L/C',
                interestGroup: 'Product Group'
            },
            product: 'ATLAS',
            tpAccNo: '12345',
            location: 'IN/SBCML',
            isValid: true,
            country: 'India',
            comments: 'N/A'
        }),
        Ember.Object.create({
            idType: 'Voter ID',
            id: 22,
            idNumber: 'JGKJBSW78658',
            enityConfig: {
                color: 'blue-500',
                value: 'G',
                size: "medium"
            },
            isValid: false,
            product: 'ATLAS',
            tpAccNo: '12346',
            location: 'SG/SCBL',
            country: 'Singapore',
            comments: 'Invalid id number'
        }),
        Ember.Object.create({
            idType: 'Adhar',
            id: 33,
            idNumber: 'JGKJBGSW78658',
            enityConfig: {
                color: 'amber-500',
                value: 'D',
                size: "medium"
            },
            isValid: false,
            product: 'ATLAS',
            tpAccNo: '12347',
            location: 'MY/SBCML',
            country: 'India',
            comments: 'Comments Here'
        })
    ]),
    getTableConfig() {
        return {
            tableHeading: 'Nested Card',
            content: this.get('tableContent'),
            multiSelect: true,
            isNestedCard: true,
            entityNameField: 'idType',
            filterable: true,
            sortable: true,
            filterConditions: ['contains', 'equal'],
            nestedCardConfig: {
                componentName: 'nested-card-table-row',
                componentConfigField: 'componentConfig'
            },
            columns: [{
                field: 'idType',
                type: 'link',
                action: 'linkAction',
                title: 'ID Type'
            }, {
                field: 'idNumber',
                isPriorityWidth: true,
                action: 'linkAction',
                title: 'ID Number'
            }, {
                field: 'isValid',
                type: 'boolean',
                title: 'Valid'
            }, {
                field: 'country',
                type: 'text',
                title: 'Country'
            }, {
                field: 'comments',
                type: 'text',
                title: 'Comments'
            }]
        };
    },
    actions: {
        auditTrialAction() {
            Ember.Logger.log('Audit trail action in the component', ...arguments);
        },
        markForApproval() {
            Ember.Logger.log('markForApproval in the component', ...arguments);
            this.mdSnackBarManager.open({
                position: 'bottom-left',
                isAutoClose: true,
                text: "Marked for Approval"
            });
        }
    }
});