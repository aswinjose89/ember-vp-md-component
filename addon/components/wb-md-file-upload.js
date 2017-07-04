import WbFileUplod from 'wb-ui-components/components/wb-file-upload';
import layout from 'wb-ui-md-components/templates/components/wb-md-file-upload';
import Constants from 'wb-ui-md-components/utils/constants';
export default WbFileUplod.extend({
    layout: layout,
    maxSizeText: "",
    placeHolder: "SELECT FILE",
    maxSize: 50000,
    iconName: "",
    change: function (evt) {
        if (evt.target.files[0]) {
            this.set('newFile', evt.target.files[0]);
            this.isFileValid();
            this.sendAction("afterFileSelect", this.get('selectedFile'), this.get('isFileSizeInvalid'), this.get('isFileTypeInvalid'));
            this.set('newFile', null);
        }
    },
    isFileTypeValid: function () {
        let acceptedTypeStr, selectedFileType, acceptedType, acceptedTypeArray, i, excludedType,selectedFileExtention;
        acceptedTypeStr = this.get('acceptedType');
        selectedFileType = this.get('newFile').type;
        selectedFileExtention=this.get('newFile').name.split('.').pop();
        excludedType = this.get('excludedType');
        if (acceptedTypeStr !== '*' && (!excludedType || !excludedType.isArray)) {
            acceptedTypeArray = acceptedTypeStr.split(',');
            if (!Ember.isEmpty(selectedFileType)) {
                if (acceptedTypeStr.indexOf(selectedFileType) > -1) {
                    return true;
                }

                /* if accepted type is generic, eg. audio/* then selectedType audio/mp3 should be valid */
                for (i = acceptedTypeArray.length - 1; i >= 0; i--) {
                    acceptedType = acceptedTypeArray[i];
                    if (acceptedType.indexOf('/*') > -1) {
                        if (selectedFileType.split('/')[0] === acceptedType.split('/')[0]) {
                            return true;
                        }
                    }
                }
            }

            return false;
        } else {
             if (excludedType && (excludedType.includes(selectedFileType)||excludedType.includes(selectedFileExtention))) {
                return false;
            }
        }

        return true;
    }
});