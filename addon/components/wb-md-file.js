import Ember from 'ember';
import layout from '../templates/components/wb-md-file';
import Constants from 'wb-ui-md-components/utils/constants';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    layout,
    type: "",
    name: "",
    limit: 3,
    dots: false,
    file: null,
    classNameBindings: [
        'isUploading:global-attachment_status_disabled',
        'readOnly:global-attachment_status_readonly',
        'disabled:global-attachment_status_disabled',
        'isViewOnly:global-attachment_status_viewonly'
    ],
    classNames: ['global-attachment'],
    isUploading: false,
    fileType: Ember.computed('type', 'file', function () {
        let fileType = "",
            fileTypeForClass = "";
        if (!Ember.isEmpty(this.get('type'))) {
            fileType = this.get('type').toLowerCase();
        } else if (!Ember.isEmpty(this.get('file')) && !Ember.isEmpty(this.get('file.fileName'))) {
            var re = /(?:\.([^.]+))?$/;
            var nameArr = re.exec(this.get('file.fileName'));
            if (nameArr.length > 1 && !Ember.isEmpty(nameArr[1])) {
                fileType = nameArr[1].toLowerCase();
            }
        }
        if (!Ember.isEmpty(fileType)) {
            if (Constants.fileExtArr.indexOf(fileType) > -1) {
                fileTypeForClass = `global-file-type_${fileType}`;
            } else {
                fileTypeForClass = 'global-file-type_txt';
            }
        }
        this.set("fileTypeClass", fileTypeForClass);
        return fileType;
    }),
    click() {
        this.send('fileClickAction');
    },
    mouseEnter() {
        this.mdTooltipManager.open({
            label: this.get('name'),
            shownOnOverflow: true
        });
    },
    mouseLeave() {
        this.mdTooltipManager.close();
    },
    actions: {
        fileClickAction() {
            this.sendAction("onClickAction", this.get('file'));
            Ember.tryInvoke(this, 'onClickAction');
        }
    }
});