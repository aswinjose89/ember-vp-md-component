import Ember from 'ember';
import layout from '../templates/components/wb-md-file-type';
import Constants from 'wb-ui-md-components/utils/constants';

export default Ember.Component.extend({
    layout,
    type: "",
    fileExt: "",
    limit: 3,
    dots: false,
    classNames: ['global-file-type'],
    classNameBindings: [
        'fileTypeClass'
    ],
    fileTypeClass: Ember.computed('type', 'file', function () {
        let fileExt = "", fileTypeClass = "";
        if (!Ember.isEmpty(this.get('type'))) {
            fileExt = this.get('type').toLowerCase();
        } else if (!Ember.isEmpty(this.get('file')) && !Ember.isEmpty(this.get('file.fileName'))) {
            var re = /(?:\.([^.]+))?$/;
            var nameArr = re.exec(this.get('file.fileName'));
            if (nameArr.length > 1 && !Ember.isEmpty(nameArr[1])) {
                fileExt = nameArr[1].toLowerCase();
            }
        }
        this.set("fileExt", fileExt);
        if (!Ember.isEmpty(fileExt)) {
            if (Constants.fileExtArr.indexOf(fileExt) > -1) {
                fileTypeClass = `global-file-type_${fileExt}`;
            } else {
                fileTypeClass = 'global-file-type_txt';
            }
        }
        return fileTypeClass;
    })
});
