import Ember from 'ember';

export default Ember.Mixin.create({
    "linkDocuments": [{
        "documentId": "20150629100863695",
        "categoryType": "AWS",
        "fileName": "TEST_2.pdf",
        "fileExtension": "pdf",
        "description": "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park. Broadway theater is staged in neon-lit Times Square.",
        "uploadedBy": "1193293",
        "uploadedDate": 1435575376748,
        "fileCategory": {
            "categoryType": "AD",
            "description": "Approval Documents"
        }
    }, {
        "documentId": "20150629100863694",
        "categoryType": "PP",
        "fileName": "SvnLink.pdf",
        "fileExtension": "pdf",
        "description": "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park. Broadway theater is staged in neon-lit Times Square.c",
        "uploadedBy": "1193293",
        "uploadedDate": 1435575354475,
        "fileCategory": {
            "categoryType": "AD",
            "description": "Approval Documents"
        }
    }, {
        "documentId": "20150629100863683",
        "categoryType": "WF",
        "fileName": "TEST.pdf",
        "fileExtension": "pdf",
        "description": "testinNew York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park. Broadway theater is staged in neon-lit Times Square.aaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "uploadedBy": "1193293",
        "uploadedDate": 1435572417607,
        "fileCategory": {
            "categoryType": "AD",
            "description": "Approval Documents"
        }
    }, {
        "documentId": "20150629100863682",
        "categoryType": "AD",
        "fileName": "TEST4.pdf",
        "fileExtension": "pdf",
        "description": "bbbbbbbbbNew York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park. Broadway theater is staged in neon-lit Times Square.bbbbbbbbbbbbbbb",
        "uploadedBy": "1193293",
        "uploadedDate": 1435572334047,
        "fileCategory": {
            "categoryType": "TD",
            "description": "Transaction Documents"
        }
    }, {
        "documentId": "20150629100863681",
        "categoryType": "PP",
        "fileName": "TEST5.pdf",
        "fileExtension": "pdf",
        "description": "testing attachment section whether is displayed alignment section fine in the : report.  testing..",
        "uploadedBy": "1193293",
        "uploadedDate": 1435572164885,
        "fileCategory": {
            "categoryType": "WF",
            "description": "Working Files"
        }
    }],
    "attachmentCategories": [{
        "categoryType": "AD",
        "description": "Approval Documents"
    }, {
        "categoryType": "AWS",
        "description": "Announcements & Write-ups"
    }, {
        "categoryType": "PP",
        "description": "Pitches/Presentations"
    }, {
        "categoryType": "TD",
        "description": "Transaction Documents "
    }, {
        "categoryType": "WF",
        "description": "Working Files"
    }],
    "uploadQueueDummyList": [{
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            deleted: false,
            attachmentType: "FILE",
            fileName: 'Sample File Name 1',
            sizeInMb: 3.1,
            fileExtension: "doc",
            isFileUploading: true,
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents",
            },
            isPrivateFile: true
        },
        {
            description: 'description',
            categoryType: 'AD',
            uploadedBy: 'uploadedBy',
            tempAttachmentId: Math.floor(Math.random() * 10000100001),
            uploadedDate: (new Date()).getTime(),
            isFileUploading: true,
            deleted: false,
            attachmentType: "FILE",
            fileName: 'Sample File Name 2',
            sizeInMb: 3.1,
            fileExtension: "pdf",
            "fileCategory": {
                "categoryType": "AD",
                "description": "Approval Documents"
            },
            isPrivateFile: true
        }
    ]
});