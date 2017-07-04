import Ember from 'ember';
import DataMixin from '../../mixins/md-dummy-data';
export default Ember.Route.extend(DataMixin, {
    attachmentService: Ember.inject.service('attachment-service'),
    attachmentList: Ember.A([]),
    fileUploadQueue: Ember.A([]),
    actions: {
        setLinkFilesFlyout() {
            var myArr = Ember.A([]);
            this.get('linkDocuments').map(function (obj) {
                myArr.pushObject(Ember.Object.create(obj));
            });
            this.controller.set("linkFileList", myArr);
        },
        linkSelectedFiles(selectedFiles) {
            Ember.Logger.log("selectedFiles", selectedFiles);
            if (Ember.isEmpty(this.get('attachmentList'))) {
                this.set('attachmentList', Ember.A([]));
            }
            selectedFiles.forEach(function (item) {
                this.get('attachmentList').pushObject(Ember.Object.create(item));
            }, this);
            this.controller.set('attachmentList', this.get('attachmentList'));
        },
        attachUploadedFiles(selectedFile) {
            if (Ember.isEmpty(this.get('attachmentList'))) {
                this.set('attachmentList', Ember.A([]));
            }
            this.controller.set('fileUploadQueue', this.get('fileUploadQueue'));
            Ember.Logger.log("selectedFile:", selectedFile);
            this.get('attachmentList').pushObject(Ember.Object.create(selectedFile));
            this.controller.set('attachmentList', this.get('attachmentList'));
            this.send('showFileUploadQueue', this.get('fileUploadQueue'));
            if (Ember.get(selectedFile, 'isFileUploading') === true) {
                this.get('fileUploadQueue').pushObject(selectedFile);
            }
        },
        updateUploadStatus(uploadSuccessFlag, selectedFile) {
            Ember.Logger.log("uploadSuccessFlag:", uploadSuccessFlag, "selectedFile", selectedFile);
            let attachmentArr = this.get('attachmentList'),
                filteredAttchArr;
            if (!Ember.isEmpty(attachmentArr)) {
                filteredAttchArr = attachmentArr.filterBy('tempAttachmentId', Ember.get(selectedFile, 'tempAttachmentId'));
                if (!Ember.isEmpty(filteredAttchArr) && !Ember.isEmpty(filteredAttchArr[0])) {
                    var attachment = filteredAttchArr[0];
                    if (uploadSuccessFlag) {
                        attachment.set('isFileUploading', false);
                        attachment.set('tempAttachmentId', selectedFile.newAtachmentId);
                        attachment.set('downloadLinkUrl', selectedFile.downloadLinkUrl);
                    } else {
                        Ember.Logger.error("File upload Failure");
                        filteredAttchArr = attachmentArr.filter(function (item) {
                            return Ember.get(item, 'tempAttachmentId') !== Ember.get(selectedFile, 'tempAttachmentId');
                        });
                        this.set('attachmentList', filteredAttchArr);
                        this.controller.set('attachmentList', this.get('attachmentList'));
                    }
                }
            }
        },
        openAttachmentFlyout(file, readOnlyFlag) {
            this.send('setLinkFilesFlyout');
            this.get('mdAttachmentFlyoutManager').open({
                linkFileAlertMessage: ['Do you want to link', 'selectedFileCount', 'files'],
                showAttachmentFlyout: true,
                attachAction: function (file) {
                    this.send('attachUploadedFiles', file);
                }.bind(this),
                cancelAction: function () {
                    Ember.Logger.log("cancelAction");
                }.bind(this),
                linkFilesAction: function (files) {
                    this.send('linkSelectedFiles', files);
                }.bind(this),
                uploadStatusUpdateAction: function (uploadSuccessFlag, selectedFile) {
                    this.send('updateUploadStatus', uploadSuccessFlag, selectedFile);
                }.bind(this),
                instructionMessage: "Select file from your computer to instantly add it to Deal Checklist or click " +
                    "LINK FILES to select from the library",
                isEditable: readOnlyFlag === true ? false : true,
                attachedFile: file,
                fileCategoryValues: this.get('attachmentCategories'),
                fileUploadServiceUrl: 'api/md/file/upload',
                fileDownloadServiceUrl: 'api/md/file/download',
                isFileDescriptionMandatory: true,
                fileDescriptionMaxLength: 4000,
                attachFilesDisabledFlag: false,
                fileList: this.controller.get('linkFileList'),
                excludedType: Ember.A(['bat', 'msg',
                    'application/x-envoy',
                    'application/octet-stream',
                    'application/x-bsh',
                    'application/x-sh',
                    'application/x-shar',
                    'text/x-script.sh',
                    'application/bat',
                    'application/x-bat',
                    'application/x-msdos-program',
                    'application/textedit',
                    'application/x-msdownload'
                ])
            });
        },
        cancelFileUpload(files) {
            Ember.Logger.log("cancelFileUpload: files> ", files);
            let attachmentArr = this.get('attachmentList'),
                filteredAttchArr = null;
            if (!Ember.isEmpty(files) && !Ember.isEmpty(attachmentArr)) {
                var cancelledFileIds = [];
                files.forEach(function (file) {
                    cancelledFileIds.push(Ember.get(file, 'tempAttachmentId'));
                });
                filteredAttchArr = attachmentArr.filter(function (file) {
                    return !cancelledFileIds.includes(Ember.get(file, 'tempAttachmentId'));
                });
                this.set('attachmentList', filteredAttchArr);
                this.controller.set('attachmentList', this.get('attachmentList'));
            }
        },
        displayUploadQueue() {
            var myArr = Ember.A([]);
            this.get('uploadQueueDummyList').map(function (obj) {
                myArr.pushObject(Ember.Object.create(obj));
            });
            this.controller.set("uploadQueueDummyList", myArr);
            this.send('showFileUploadQueue', this.controller.get("uploadQueueDummyList"));
        },
        showFileUploadQueue(fileUploadQueue) {
            this.get('mdFileUploadQueueManager').open({
                displayUploadQueue: true,
                uploadQueue: fileUploadQueue,
                cancelUploadAction: function (files) {
                    this.send('cancelFileUpload', files);
                }.bind(this)
            });
        },
        deleteFileAction(file) {
            Ember.set(file, 'deleted', true);
        },
        handleUploadedFile(selectedFile, isFileSizeInvalid, isFileTypeInvalid) {
            if (isFileSizeInvalid || isFileTypeInvalid) {
                this.setErrorMessage(isFileSizeInvalid, isFileTypeInvalid);
            } else {
                this.controller.set("errorMessage", null);
                var uploadedFile = this.createAttachmentRecord(selectedFile);
                this.controller.set("uploadedFile", uploadedFile);
            }
        },
        testClick(file) {
            Ember.Logger.log("FileClick", file);
        }
    },
    setErrorMessage(isFileSizeInvalid, isFileTypeInvalid) {
        if (isFileSizeInvalid) {
            this.controller.set("errorMessage", "The size of the file selected is bigger than expected." +
                " Please select file having size less than  50 MB");
        } else if (isFileTypeInvalid) {
            this.controller.set("errorMessage", "The file type you selected is not supported. ");
        }
    },
    createAttachmentRecord(selectedFile) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(selectedFile.name)[1];
        var uploadedFile = {
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: selectedFile.name,
            sizeInMb: (selectedFile.size / (1024 * 1024)).toFixed(2),
            fileExtension: ext
        };
        return uploadedFile;
    }
});