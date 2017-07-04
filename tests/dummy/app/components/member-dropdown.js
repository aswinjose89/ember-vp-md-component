import Ember from 'ember';
import layout from '../templates/components/member-dropdown';

export default Ember.Component.extend({
    layout,
    isDropdownOpen: false,
    init() {
        this._super(...arguments);
        this.set('groupableMemberDropdownConfig', this.getGroupableMemberDropdownConfig());
        this.set('simpleMemberDropdownConfig', this.getSimpleMemberDropdownConfig());
    },
    actions: {
        createAction() {
            this.set('isDropdownOpen', false);
            Ember.Logger.log('createAction called');
        },
        editContact() {
            Ember.Logger.log('editContact called', ...arguments);
        },
        memberNameClicked() {
            Ember.Logger.log('memberNameClicked called', ...arguments);
        },
        emailClicked() {
            Ember.Logger.log('emailClicked called', ...arguments);
        }
    },
    getSimpleMemberDropdownConfig() {
        return {
            type: 'select',
            isMemberDropdown: 'true',
            optionLabelPath: 'name',
            label: 'Select Member',
            dropdownHeaderAction: 'createAction',
            dropdownHeaderActionLabel: 'CREATE NEW',
            searchable: true,
            multiple: true,
            content: this.getMemberDetails(),
            resultConfig: {
                label: 'name',
                avatar: 'avatarField',
                isClient: 'isThisMemberClient',
                additonalInfoItems: 'secondaryItems'
            }
        };
    },
    getGroupableMemberDropdownConfig() {
        return {
            type: 'select',
            isMemberDropdown: 'true',
            optionLabelPath: 'name',
            label: 'Select Member',
            hasGroups: true,
            headerAction: 'createAction',
            headerActionLabel: 'CREATE NEW',
            searchable: true,
            multiple: true,
            content: this.getGroupMemberDeatils(),
            resultConfig: {
                label: 'name',
                avatar: 'avatarField',
                groupHeader: 'groupName',
                members: 'members',
                emailAction: 'emailClicked',
                isClient: 'isThisMemberClient',
                enableMemberAction: 'isActionable',
                memberAction: 'memberNameClicked',
                enableRowAction: 'isEditEnabled',
                rowAction: {
                    label: 'Edit',
                    action: 'editContact'
                },
                additonalInfoItems: 'secondaryItems'
            }
        };
    },
    getMemberDetails() {
        return Ember.A([
            Ember.Object.create({
                id: 1,
                name: 'Export Bussiness',
                secondaryItems: Ember.A([
                    { label: 'DEAL-CF-2015-12-213390' },
                    { label: 'Marketing-Potential' },
                    { label: 'Trandaction Banking' }
                ])
            }),
            Ember.Object.create({
                id: 2,
                name: 'Import Bussiness',
                isActionable: true,
                isEditEnabled: true,
                isThisMemberClient: true,
                secondaryItems: Ember.A([
                    { label: 'Marketing-Potential' },
                    {
                        label: 'DEAL-CF-2015-12-213390',
                        email: 'bs@y.com.sg'
                    },
                    { label: 'Trandaction Banking' }
                ])
            })
        ]);
    },
    getGroupMemberDeatils() {
        return Ember.A([
            Ember.Object.create({
                groupName: 'Completed Contacts',
                members: Ember.A([
                    Ember.Object.create({
                        id: 1,
                        name: 'Export Bussiness',
                        secondaryItems: Ember.A([
                            { label: 'DEAL-CF-2015-12-213390' },
                            { label: 'Marketing-Potential' },
                            { label: 'Trandaction Banking' }
                        ])
                    }),
                    Ember.Object.create({
                        id: 2,
                        name: 'Import Bussiness',
                        isActionable: true,
                        isEditEnabled: true,
                        isThisMemberClient: true,
                        secondaryItems: Ember.A([
                            { label: 'Marketing-Potential' },
                            {
                                label: 'DEAL-CF-2015-12-213390',
                                email: 'bs@y.com.sg'
                            },
                            { label: 'Trandaction Banking' }
                        ])
                    })
                ])
            }),
            Ember.Object.create({
                groupName: 'Incomplete Contacts',
                members: Ember.A([
                    Ember.Object.create({
                        id: 3,
                        name: 'Export Bussiness',
                        secondaryItems: Ember.A([
                            { label: 'DEAL-CF-2015-12-213390' },
                            { label: 'Marketing-Potential' },
                            { label: 'Trandaction Banking' }
                        ])
                    }),
                    Ember.Object.create({
                        id: 4,
                        name: 'Import Bussiness',
                        isActionable: true,
                        isEditEnabled: true,
                        isThisMemberClient: true,
                        secondaryItems: Ember.A([
                            { label: 'Marketing-Potential' },
                            {
                                label: 'DEAL-CF-2015-12-213390',
                                email: 'bs@y.com.sg'
                            },
                            { label: 'Trandaction Banking' }
                        ])
                    })
                ])
            })
        ]);
    }
});