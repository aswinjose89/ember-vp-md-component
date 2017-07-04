import WbFlyout from 'wb-ui-components/components/wb-flyout';
import layout from 'wb-ui-md-components/templates/components/wb-md-attachment-flyout';
import ComponentHelper from 'wb-ui-md-components/mixins/component-helper';
import ClickOutside from '../mixins/click-outside';
import Constants from 'wb-ui-md-components/utils/constants';
import Ember from 'ember';

export default WbFlyout.extend(ComponentHelper, ClickOutside, Constants, {
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));

        if (!Ember.isBlank(this.get('attachedFile'))) {
            this.set('isExistingFile', true);
            var desc = this.get('attachedFile.description');
            this.set('attachedFile.description', "");
            this.set('attachedFile.description', desc);
        } else {
            this.set('isExistingFile', false);
        }
        this.set('oldFile', null);
        this.set("validationResponse", null);
    },
    //fileList : Ember.computed.alias('config.componentConfig.fileList'),
    outSideComponent: ".global-slidebar__container",
    wbUserProfile: Ember.inject.service(),
    attachmentService: Ember.inject.service('attachment-service'),
    layout: layout,
    instructionMessage: "Select file from your computer to instantly upload it",
    instructionTitle: "Attach File",
    fileCategoryLabel: "Category",
    fileDescriptionLabel: "Description",
    privateFileFlagLabel: "Make Private",
    isFileDescriptionMandatory: false,
    fileDescriptionMaxLength: 140,
    fileCategoryValues: [],
    isFileCategoryMandatory: false,
    isCategoryDisplayed: true,
    isDescriptionDisplayed: true,
    isPrivateFileFlagDisplayed: true,
    isPrivateFileFlagMandatory: false,
    isLinkFilesButtonDisplayed: true,
    fileDownloadServiceUrl: "",
    fileUploadServiceUrl: "",
    attachFilesDisabledFlag: false,
    fileInputPlaceHolder: "SELECT FILE",
    fileMaxSize: 50000,
    fileMaxSizeText: "MAX SIZE 50 MB", // Displayed on upload button
    fileSizeLimitText: "50 MB", // Displayed in the error message
    fileSizeLimitExceedMessage: null, //Error Message to display if attached file size is greater than allowed limit
    fileTypeText: "Supported file types - PPT, XLS, PDF, DOC and Images",
    errorMessage: "",
    showAttachFilesSectionFlag: true,
    showSelectedLinkFileCount: false,
    showMore: false,
    descriptionShowLength: 100,
    fileList: [],
    originalAttachmentCount: 0,
    maxAttachmentCount: 100,
    isExistingFile: false,
    uploadFileOnSelect: true,
    validateFile: false,
    validationResponse: null,
    isLinkFilesReadOnly: true,
    isDeletable: true,
    acceptedType: Ember.computed('excludedType', function () {
        return Ember.isEmpty(this.get('excludedType')) ? Constants.acceptedFileTypes : '*';
    }),
    excludedType: null,
    selectedFileCount: Ember.computed('fileList.@each.isSelected', function () {
        var selectedFiles = this.getSelectedFilesToLink();
        return selectedFiles ? selectedFiles.length : 0;
    }),
    isDoneDisabled: Ember.computed.not('isDoneEnabled'),
    watchForDoneBtnEnabling: Ember.on('init', Ember.observer('selectedFileCount', 'attachedFile', 'isValidForm', function () {
        let isDoneEnabled = false,
            selectedFileCount = this.get('selectedFileCount'),
            attachedFile = this.get('attachedFile'),
            isValidForm = this.get('isValidForm');
        if (!Ember.isBlank(attachedFile)) {
            var attachedFileType = Ember.get(attachedFile, 'attachmentType');
            if (isValidForm === true && attachedFileType === 'FILE' && this.get('isEditable') === true) {
                isDoneEnabled = true;
            } else if (attachedFileType !== 'FILE' && selectedFileCount > 0) {
                isDoneEnabled = true;
            }
        } else {
            if (selectedFileCount > 0) {
                isDoneEnabled = true;
            }
        }
        this.set('isDoneEnabled', isDoneEnabled);
    })),
    watchAttachmentChanges: Ember.on('init', Ember.observer("attachedFile.description", "attachedFile.isPrivateFile",
        "attachedFile.markedForDeletion", "attachedFile.fileCategory",
        function () {
            let attachedFile = this.get('attachedFile');
            if (!Ember.isBlank(attachedFile)) {
                if ((this.get('isFileDescriptionMandatory') && Ember.isBlank(Ember.get(attachedFile, 'description'))) ||
                    (this.get('isFileCategoryMandatory') && Ember.isBlank(Ember.get(attachedFile, 'fileCategory'))) ||
                    (this.get('isPrivateFileFlagMandatory') && Ember.get(attachedFile, 'isPrivateFile') !== true) ||
                    Ember.get(attachedFile, 'markedForDeletion') === true) {
                    this.set('isValidForm', false);
                    this.set('isTrashEnabled', false);
                } else {
                    this.set('isValidForm', true);
                }
                this.set('showFileUploadBtn', false);
            } else {
                this.set('isValidForm', false);
                this.set('showFileUploadBtn', true);
            }
            if (attachedFile && Ember.get(attachedFile, 'markedForDeletion') === true) {
                this.set('showFileUploadBtn', true);
            }
        })),
    watchDisplay: Ember.on('init', Ember.observer("showAttachmentFlyout", function () {

        if (this.get('showAttachmentFlyout') !== true) {
            this.set("errorMessage", null);
            var selectedFiles = this.getSelectedFilesToLink();
            if (!Ember.isEmpty(selectedFiles)) {
                selectedFiles.forEach(function (file) {
                    file.set('isSelected', false);
                });
            }
        } else {
            let attachedFile = this.get('attachedFile');
            if (Ember.isEmpty(attachedFile)) {
                this.set('showFileUploadBtn', true);
            } else {
                this.set('showFileUploadBtn', false);
            }
        }
    })),
    watchValidationResponse: Ember.on('init', Ember.observer("validationResponse.success", function () {
        if (!Ember.isEmpty(this.get('validationResponse'))) {
            if (this.get('validationResponse.success') === true) {
                var isFileAlreadyValidated = true;
                this.set('fileUploadServiceUrl', this.get("fileUploadServiceUrl").replace(':doc_Id', this.get('validationResponse.docId')));
                this.send('attachFilesAction', isFileAlreadyValidated);
            } else if (this.get('validationResponse.success') === false && this.get('validationResponse.message')) {
                this.set("errorMessage", this.get('validationResponse.message'));
            }
        }
    })),
    click(e) {
        if (e.target.classList.contains('global-slidebar')) {
            this.send('cancelAction');
        }
    },
    getLinkFileAlertMessage(selectedFileCount) {
        let linkFileAlertMessage = this.get('linkFileAlertMessage');
        if (Ember.typeOf(linkFileAlertMessage) === 'array') {
            let selectedFileCountIndex = linkFileAlertMessage.indexOf('selectedFileCount');
            if (selectedFileCountIndex !== -1) {
                linkFileAlertMessage[selectedFileCountIndex] = selectedFileCount;
            }
        }
        return linkFileAlertMessage.join(' ');
    },
    actions: {
        deleteFile(file) {
            Ember.set(file, 'markedForDeletion', true);
            this.set('oldFile', file);
        },
        cancelAction() {
            let attachedFile = this.get('attachedFile');
            if (!Ember.isBlank(attachedFile) && Ember.get(attachedFile, 'markedForDeletion') === true) {
                this.set('attachedFile', this.get('oldFile'));
                Ember.set(attachedFile, 'markedForDeletion', false);
            }
            this.toggleProperty('showAttachmentFlyout');
            if (this.get('cancelAction')) {
                var result = this.get('cancelAction').call();
            }
        },
        openLinkFiles() {
            this.toggleProperty('showAttachFilesSectionFlag');
        },
        cancelLinkFileAction() {
            this.toggleProperty('showAttachFilesSectionFlag');
        },
        attachAndLinkFiles() {
            var selectedFiles = this.getSelectedFilesToLink();
            if (selectedFiles && selectedFiles.length > 0) {
                this.send('confirmLinkFilesAction', selectedFiles.length);
            } else {
                this.send('attachFilesAction');
            }
        },
        confirmLinkFilesAction(selectedFileCount) {
            let totalAttachmentCount = this.get('originalAttachmentCount') + selectedFileCount,
                maxAttachmentCount = this.get('maxAttachmentCount');
            if (!Ember.isBlank(this.get('attachedFile')) && this.get('isExistingFile') !== true && this.get('isValidForm')) {
                totalAttachmentCount++;
            }
            if (totalAttachmentCount > maxAttachmentCount) {
                let message = `Only ${maxAttachmentCount} files are allowed per question. Please remove or delink some files.`;
                this.mdDialogManager.alert({
                    buttonLabel: 'GOT IT',
                    title: 'File Limit Exceeded',
                    message: message
                });
                this.set('attachUpload', false);
            } else {
                let linkFileAlertMessage = this.get('linkFileAlertMessage'),
                    msg = Ember.isPresent(linkFileAlertMessage) ? this.getLinkFileAlertMessage(selectedFileCount) : `This will link ${selectedFileCount} document(s) to this question.`;
                this.mdDialogManager.confirm({
                    cancelButtonLabel: 'CANCEL',
                    confirmButonLabel: 'LINK',
                    title: 'Link Selected File(s)?',
                    message: msg
                }).then(() => {
                    this.send('linkFilesAction');
                    this.send('attachFilesAction');
                });
            }
        },
        attachFilesAction(isFileAlreadyValidated) {
            if (this.get('isValidForm')) {
                var attachment = this.get('attachedFile');
                if (this.get('uploadFileOnSelect') !== true && Ember.get(attachment, 'isFileUploadPaused') === true) {
                    var file = this.get('selectedFile');
                    if (this.get('validateFile') === true && isFileAlreadyValidated !== true) {
                        var validationResponse = this.get('validationAction').call(validationResponse, file, attachment);
                        this.set('validationResponse', validationResponse);
                    } else {
                        this.send('uploadFile', file, false, false, true, attachment);
                        var result = this.get('attachAction').call(result, this.get('attachedFile'));
                        this.set('showAttachmentFlyout', false);
                        this.set('showAttachFilesSectionFlag', true);
                        //this.toggleProperty('showAttachmentFlyout');
                    }

                } else {
                    var result = this.get('attachAction').call(result, this.get('attachedFile'));
                    this.set('showAttachmentFlyout', false);
                    this.set('showAttachFilesSectionFlag', true);
                    //this.toggleProperty('showAttachmentFlyout');
                }
            } else {
                this.set('showAttachmentFlyout', false);
                this.set('showAttachFilesSectionFlag', true);
            }
        },
        linkFilesAction() {
            var selectedFiles = this.getSelectedFilesToLink();
            if (selectedFiles && selectedFiles.length > 0) {
                var result = this.get('linkFilesAction').call(result, this.getLinkedFilesArr(selectedFiles));
                this.set('fileList', Ember.A([]));
            }
            //this.set('showAttachFilesSectionFlag',true);
            //this.set('showAttachmentFlyout',false);
        },
        uploadFile(selectFile, isFileSizeInvalid, isFileTypeInvalid, isValidated, attachment) {
            if (isFileSizeInvalid || isFileTypeInvalid) {
                this.setErrorMessage(isFileSizeInvalid, isFileTypeInvalid);
            } else {
                this.set("errorMessage", null);
                if (Ember.isEmpty(attachment)) {
                    attachment = this.createAttachmentRecord(selectFile);
                    this.set('attachedFile', attachment);
                }
                if (this.get('uploadFileOnSelect') === false && !isValidated) {
                    this.set('selectedFile', selectFile);
                    Ember.set(attachment, 'isFileUploading', false);
                    Ember.set(attachment, 'isFileUploadPaused', true);
                } else {
                    this.set("errorMessage", null);
                    Ember.set(attachment, 'isFileUploadPaused', false);
                    Ember.set(attachment, 'isFileUploading', true);
                    Ember.set(attachment, "categoryType", Ember.get(attachment, "fileCategory.categoryType"));
                    var formData = new FormData();
                    formData.append("docContextRegisterDocument.id", "attachment");
                    formData.append("docTransactionFiles[0].multipartFile", selectFile);
                    formData.append("docId", this.get('validationResponse.docId'));
                    formData.append("ContentId", "attachment");
                    formData.append("attachmentRecord", JSON.stringify(attachment));
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', this.get('fileUploadServiceUrl'), true);
                    xhr.setRequestHeader('WB-TOKEN', this.get('session.secure.wbToken'));
                    var uploadSuccessFlag = true;
                    var response = null;
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            response = JSON.parse(xhr.responseText);
                            if (Ember.get(response, 'result.id')) {
                                var exportUrl = this.get('fileDownloadServiceUrl').replace(':doc_Id', response.result.id);
                                Ember.set(attachment, 'newAttachmentId', response.result.id);
                                Ember.set(attachment, 'linkedAttachmentId', response.result.id);
                                if (this.get('attachedFile')) {
                                    Ember.set(this.get('attachedFile'), 'percentComplete', "");
                                }
                                Ember.set(attachment, 'isFileUploading', false);
                                Ember.set(attachment, 'downloadLinkUrl', exportUrl);
                                this.get('attachmentService').updateFileUpdateProgress(attachment.tempAttachmentId, { loaded: selectFile.size, total: selectFile.size, xhr: xhr, attachment: attachment }, true);
                            } else {
                                uploadSuccessFlag = false;
                                this.handleFileUploadError(attachment);
                            }
                        } else {
                            uploadSuccessFlag = false;
                            this.handleFileUploadError(attachment);
                        }
                        var result = this.get('uploadStatusUpdateAction').call(result, uploadSuccessFlag, attachment, response);
                    }.bind(this);
                    xhr.upload.addEventListener("progress", function (e) {
                        if (e.total > 0) {
                            var pc = parseInt((e.loaded / e.total) * 100);
                            if (pc === 100) {
                                pc = "99";
                            }
                            if (this.get('attachedFile')) {
                                Ember.set(this.get('attachedFile'), 'percentComplete', pc + "%");
                            }
                            this.get('attachmentService').updateFileUpdateProgress(attachment.tempAttachmentId, { loaded: e.loaded, total: e.total, xhr: xhr, attachment: attachment });
                        }
                    }.bind(this), false);
                    xhr.upload.onerror = function () {
                        uploadSuccessFlag = false;
                        this.handleFileUploadError(attachment);
                        var result = this.get('uploadStatusUpdateAction').call(result, uploadSuccessFlag, attachment, response);
                    }.bind(this);
                    xhr.onerror = function () {
                        uploadSuccessFlag = false;
                        this.handleFileUploadError(attachment);
                        var result = this.get('uploadStatusUpdateAction').call(result, uploadSuccessFlag, attachment, response);
                    }.bind(this);
                    xhr.send(formData);
                    this.set('oldFile', null);
                }
            }
        }
    },
    createAttachmentRecord(selectFile) {
        let userProfile = this.get('wbUserProfile').get('userProfile');
        var uploadedBy = null;
        if (userProfile) {
            uploadedBy = userProfile.get('psId') + " - " + userProfile.get('firstName') + " " + userProfile.get('lastName');
        }
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(selectFile.name)[1];
        var description = "",
            categoryType = "",
            fileCategory = null,
            isPrivateFile = false;
        if (this.get('oldFile')) {
            description = this.get('oldFile.description');
            categoryType = this.get('oldFile.categoryType');
            fileCategory = this.get('oldFile.fileCategory');
            isPrivateFile = this.get('oldFile.isPrivateFile');
        }
        var attachment = {
            description: description,
            categoryType: categoryType,
            uploadedBy: uploadedBy,
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            isFileUploading: true,
            deleted: false,
            attachmentType: "FILE",
            fileName: selectFile.name,
            sizeInMb: (selectFile.size / (1024 * 1024)).toFixed(2),
            fileExtension: ext,
            fileCategory: fileCategory,
            isPrivateFile: isPrivateFile,
            percentComplete: "0%"
        };
        return attachment;
    },
    setErrorMessage(isFileSizeInvalid, isFileTypeInvalid) {
        if (isFileSizeInvalid) {
            let errorMessage;

            if (this.get("fileSizeLimitExceedMessage")) {
                errorMessage = this.get("fileSizeLimitExceedMessage");
            } else {
                errorMessage = `The size of the file selected is bigger than expected. Please select file having size less than  ${this.get('fileSizeLimitText')}`;

            }

            this.set("errorMessage", errorMessage);
        } else if (isFileTypeInvalid) {
            this.set("errorMessage", this.get('fileTypeText'));
        }
    },
    handleFileUploadError(failedAttachment) {
        Ember.Logger.error("File upload failed.");
        Ember.set(failedAttachment, 'isFileUploading', false);
        if (this.get('showAttachmentFlyout') === true) {
            var failedTempAttachmentId = Ember.get(failedAttachment, 'tempAttachmentId');
            var currentFile = this.get('attachedFile');
            if (!Ember.isBlank(currentFile) && failedTempAttachmentId === Ember.get(currentFile, 'tempAttachmentId')) {
                this.set('errorMessage', "File upload failed");
                this.set('attachedFile', null);
            }
        }
        this.set('oldFile', failedAttachment);
        Ember.set(failedAttachment, 'isError', true);
    },
    getSelectedFilesToLink() {
        var selectedFiles = null;
        if (!Ember.isEmpty(this.get('fileList'))) {
            selectedFiles = this.get('fileList').filter(function (obj) {
                return obj.get('isSelected');
            });
        }
        return selectedFiles;
    },
    getLinkedFilesArr(selectedFiles) {
        let userProfile = this.get('wbUserProfile').get('userProfile');
        var uploadedBy = null;
        if (userProfile) {
            uploadedBy = userProfile.get('psId') + " - " + userProfile.get('firstName') + " " + userProfile.get('lastName');
        }
        var inkedFilesArr = [];
        selectedFiles.forEach(function (file) {
            var linkedFile = {
                description: file.get('description'),
                categoryType: file.get('categoryType'),
                uploadedBy: uploadedBy,
                tempAttachmentId: Math.floor(Math.random() * 10000100001),
                linkedAttachmentId: file.get('documentId'),
                uploadedDate: (new Date()).getTime(),
                deleted: false,
                attachmentType: "LINKAGE",
                fileName: file.get('fileName'),
                sizeInMb: file.get('sizeInMb'),
                fileExtension: file.get('fileExtension'),
                isFileUploading: false,
                downloadLinkUrl: file.get('downloadLinkUrl')
            };
            inkedFilesArr.push(linkedFile);
        });
        return inkedFilesArr;
    }
});