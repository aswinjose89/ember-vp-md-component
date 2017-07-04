import Ember from 'ember';
import layout from 'wb-ui-md-components/templates/components/wb-md-file-uploaded-file';
export default Ember.Component.extend({
    layout: layout,
    isEditable:false,
    displayPercentComplete : true,
    init(){
        this._super(...arguments);
    },
    actions: {
        deleteFile(e){
            e.preventDefault();
            this.sendAction("deleteFileAction", this.get('file'));
        }
    }
});
