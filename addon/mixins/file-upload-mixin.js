import Ember from 'ember';

export default Ember.Mixin.create({
  inValidSizeErrorMsg : 'The size of the file selected is bigger than expected.',
  inValidTypeErrorMsg: 'The file type you selected is not supported.',
  actions: {
    handleUploadedFile(selectedFile, isFileSizeInvalid, isFileTypeInvalid){
      var self = this;
      if(isFileSizeInvalid || isFileTypeInvalid){
        	this.setFileUploadErrorMessage(isFileSizeInvalid , isFileTypeInvalid);
       }else{
        this.setProperties({
          'errorMessage': null,
          'percentComplete': 0
        });
        var formData= new FormData(),
        	xhr= new XMLHttpRequest();
		    formData.append('file',selectedFile);
		    xhr.open('POST',this.get('fileUploadServiceUrl'),true);
        xhr.setRequestHeader('WB-TOKEN', this.get('session.secure.wbToken'));
        xhr.onload = function () {
           if(xhr.status==200){
              	let response = JSON.parse(xhr.responseText),
              		uploadedFile = this.createAttachmentRecord(selectedFile,response);
              this.get("files").pushObject(uploadedFile);
              this.set("file",uploadedFile);
            } else {
              this.setFileUploadErrorMessage();
            }
        }.bind(this);
		xhr.upload.addEventListener("progress", function (e) {
          if (e.total > 0) {
            var pc = parseInt((e.loaded / e.total) * 100);
            if (pc === 100) {
              pc = "99";
            }
            this.set('percentComplete', pc);
          }
        }.bind(this), false);
        xhr.onerror = function(){
				this.setFileUploadErrorMessage();
		}.bind(this);
		    xhr.send(formData);
       }
    }
  },
  setFileUploadErrorMessage(isFileSizeInvalid, isFileTypeInvalid){
      if(isFileSizeInvalid){
        this.set('fileUploadErrorMessage',this.get('inValidSizeErrorMsg'));
      }else if(isFileTypeInvalid){
         this.set('fileUploadErrorMessage',this.get('inValidTypeErrorMsg'));
      } else {
         this.set('fileUploadErrorMessage','File upload failed');
      }
  }
});
