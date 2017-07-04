import Ember from 'ember';
import layout from 'wb-ui-md-components/templates/components/wb-md-file-upload-queue';
import ComponentHelper from 'wb-ui-md-components/mixins/component-helper';
const { Component } = Ember;
export default Component.extend(ComponentHelper, {
    componentConfig: Ember.computed.alias('config.componentConfig'),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('componentConfig'), 'componentConfig');
    },
    attachmentService: Ember.inject.service('attachment-service'),
    layout: layout,
    displayUploadQueue: false,
    minimizeUploadQueue: false,
    actions: {
        minimize() {
            this.set('minimizeUploadQueue', true);
        },
        maximize() {
            this.set('minimizeUploadQueue', false);
        },
        confirmCancelSingleUpload(file) {
            if (!file.isFileUploading) {
                var uploadQueue = this.get('uploadQueue');
                var newUploadQueue = uploadQueue.filter(function (obj) {
                    return obj !== file;
                });
                this.set('uploadQueue', newUploadQueue);
                var result = this.get('cancelUploadAction').call(result, newUploadQueue, true);
                this.get('attachmentService').updateFileUpdateProgress(file.tempAttachmentId, file, true);
            } else {
                let msg = "File upload is still in progress. Are you sure you want to cancel?";
                this.mdDialogManager.confirm({
                    cancelButtonLabel: 'CONTINUE UPLOAD',
                    confirmButonLabel: 'CANCEL UPLOAD',
                    title: 'Cancel Upload?',
                    message: msg
                }).then(() => {
                    this.send('cancelSingleUpload');
                });
                this.set('cancelSingleUploadFile', file);
            }
        },
        cancelSingleUpload() {
            var file = this.get('cancelSingleUploadFile');
            this.set('cancelSingleUploadFile.isCancelled', true);
            var uploadQueue = this.get('uploadQueue');
            var newUploadQueue = uploadQueue.filter(function (obj) {
                return !obj.isCancelled;
            });
            this.set('uploadQueue', newUploadQueue);
            var result = this.get('cancelUploadAction').call(result, [file], false);
            this.get('attachmentService').updateFileUpdateProgress(file.tempAttachmentId, file, true);
        },

        confirmCancelAllUploads() {
            var uploadQueue = this.get('uploadQueue');
            var uploadingQueue = uploadQueue.filter(function (obj) {
                return obj.isFileUploading;
            });
            if (Ember.isBlank(uploadingQueue)) {
                this.set('uploadQueue', []);
                var result = this.get('cancelUploadAction').call(result, [], true);
                this.get('attachmentService').resetFileUploadProgressMap();
            } else {
                let msg = "File upload is still in progress. Are you sure you want to cancel?";
                this.mdDialogManager.confirm({
                    cancelButtonLabel: 'CONTINUE UPLOAD',
                    confirmButonLabel: 'CANCEL UPLOAD',
                    title: 'Cancel All Uploads?',
                    message: msg
                }).then(() => {
                    this.send('cancelAllUploads');
                });
            }
        },
        cancelAllUploads() {
            var uploadQueue = this.get('uploadQueue');
            var uploadingQueue = uploadQueue.filter(function (obj) {
                return obj.isFileUploading;
            });
            this.set('uploadQueue', []);
            this.get('attachmentService').resetFileUploadProgressMap();
            var result = this.get('cancelUploadAction').call(result, [], true);
        }
    }
});