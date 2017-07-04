import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from 'ember';
import EmberValidations, { validator } from 'ember-validations';

export default Model.extend(EmberValidations, {
    emailId: attr('string'),
    atwUser: attr('string'),
    atwUserType: attr('number'),
    roleHeadType: attr('number'),
    userCountry: attr('string'),
    country: belongsTo('country'),
    createdDate: attr('string'),
    customContent: hasMany('country'),
    isDisabled: attr('boolean'),
    isReadOnly: attr('boolean'),
    isChecked: attr('boolean'),
    shortDescription: attr('string'),
    nationalities: hasMany('country'),
    jobTitle: attr('string'),
    department: attr('string'),
    lastName: attr('string'),
    firstName: attr('string'),
    description: attr('string'),
    fullName: Ember.computed('firstName', 'lastName', function () {
        return `${this.get('firstName')} ${this.get('lastName')}`;
    }),
    roleHead: attr('string'),
    psId: attr('number'),
    user: attr(),
    disableFirstName: attr('boolean'),
    hasErrors: Ember.computed.not('isValid'),
    margin: attr('number'),
    focused: true,
    canValidate: Ember.computed('margin', function () {
        return Ember.isPresent(this.get('margin')) && this.get('margin') > 0;
    }),
    validations: {
        firstName: {
            format: {
                allowBlank: true,
                with: new RegExp("^[a-zA-Z]*$"),
                message: "Enter a valid first name"
            }
        },
        lastName: {
            format: {
                with: new RegExp("^[a-zA-Z]*$")
            },
            message: "Enter a valid last name"
        },
        country: validator(function () {
            if (Ember.isEmpty(this.model.get('country.id'))) {
                return "Please specify country";
            }
        }),
        createdDate: {
            presence: true
        },
        nationalities: {
            presence: true
        },
        margin: {
            numericality: {
                if: 'canValidate',
                greaterThan: 1000,
                lessThanOrEqualTo: 9999
            }

        }
    }
});