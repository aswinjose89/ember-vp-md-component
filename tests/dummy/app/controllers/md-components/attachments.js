import Ember from 'ember';
import DataMixin from '../../mixins/md-dummy-data';

export default Ember.Controller.extend(DataMixin, {
    attachmentList: [{
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 1',
            sizeInMb: 3.1,
            fileExtension: "doc",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 2',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 3',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 4',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 5',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 6',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            attachmentType: "FILE",
            fileName: 'File Name 7',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            deleted: false,
            isFileUploading: false,
            isPrivateFile: true
        }
    ]
});