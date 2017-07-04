import Ember from 'ember';
import layout from '../templates/components/radio-button-section';

export default Ember.Component.extend({
    layout,
    tagName: '',
    selectedItem1: {
        value: true,
        name: 'Yes'
    },
    selectedItem2: {
        code: true,
        description: 'Yes'
    },
    value: true,
    init() {
        this._super(...arguments);
        this.setProperties({
            'radioButtonConfig': {
                title: 'Is this a Sole or Joint Deal?',
                description: 'Select “Joint” if SCB is not the only <a href="#">advising</a>/lending party',
                // errorMessage: 'Some interesting error which is very long so that it does not fit the content area provided. Also the rest of the part should auto truncate and must be shown on a modal with full error message.',
                required: true,
                name: 'question1',
                content: [{
                    value: true,
                    name: 'Yes',
                    isError: true
                }, {
                    value: false,
                    name: 'No'
                }, {
                    value: 'na',
                    name: 'Not Applicable'
                }]
            }
        });
        this.setProperties({
            'InlineRadioButtonConfig': {
                title: 'Is this a Sole or Joint Deal?',
                'name': 'question2',
                'required': true,
                'isInline': true,
                helpLinkTitle: 'Client Need explanation',
                helpModalTitle: 'Help Title',
                helpText: "This is a help message which is very long and has more than 100 words!",
                errorMessage: 'Error message',
                optionLabelPath: 'description',
                optionValuePath: 'code',
                'content': [{
                    code: true,
                    description: 'Yes',
                    disabled: true
                }, {
                    code: false,
                    description: 'No'
                }, {
                    code: 'na',
                    description: 'Not Applicable'
                }]
            }
        });
    },
    actions: {
        radioAction(val, selectedItem) {
            Ember.Logger.log("Radio button action: ", val, selectedItem);
        },
        changeSelected() {
            /*this.set('selectedItem1',{
                value: false,
                name: 'No'
            })*/

            this.set('value', false);
        }
    }
});