import Ember from 'ember';
import layout from '../templates/components/popup-example';

export default Ember.Component.extend({
    layout,
    tagName:'',
    componentConfig: Ember.computed.reads('config.componentConfig'),
    init(){
        this._super(...arguments);
        this.set('gridConfig', this.getGridConfig());
        this.set('helloFromPopup','helloFromPopup');
    },
    didRender(){
        Ember.run.later(this, function(){
            this.sendAction('helloFromPopup', 'Hello from welcome popup');
        }, 100);
    },
    getGridConfig(){
        var tableContent = Ember.A([
            Ember.Object.create({
                idType: 'Passport',
                idNumber: 'XYZKJH',
                isValid: true,
                country: 'India',
                comments: 'N/A'
            }),
            Ember.Object.create({
                idType: 'Voter ID',
                idNumber: 'JGKJBSW78658',
                isValid: false,
                country: 'Singapore',
                comments: 'Invalid id number'
            })
        ]);
        return Ember.Object.create({
            tableHeading: 'Static Table',
            content: tableContent,
            columns: [{
               field: 'idType',
               title: 'ID Type'
            }, {
               field: 'idNumber',
               title: 'ID Number'
            }, {
               field: 'isValid',
               title: 'Valid'
            }, {
               field: 'country',
               title: 'Country'
            }, {
               field: 'comments',
               title: 'Comments'
            }]
        });
    },
    actions: {
        closeDialog() {
            this.get('config.onClose').call(...this.get('config.callbackContext'));
        },
        openPopup(){
            this.mdDialogManager.popup({
                componentName: 'basic-popup',
                text: 'From the inner config, basic-popup'
            });
        }
    }
});
