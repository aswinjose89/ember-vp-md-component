import Ember from 'ember';

export default Ember.Service.extend({
   uploadingFileMap : Ember.Map.create({}),
   fileUploadProgress : "0%",
    updateFileUpdateProgress(fileId, uploadObject, uploadCompletedFlag){
        let uploadingFileMap = this.get('uploadingFileMap');
        if(uploadCompletedFlag){
            uploadingFileMap.delete(fileId);
        }else{
            uploadingFileMap.set(fileId, uploadObject);
        }
        if(uploadingFileMap.size >0 ){
            var total = 0, uploaded = 0;
            uploadingFileMap.forEach(function(value){
                total+=value.total;
                uploaded+=value.loaded;
            });
            var pc = 100;
            if(total > 0){
                pc = parseInt((uploaded/total)*100);
            }
            if(pc===100){
                this.resetFileUploadProgressMap();
            }else{
               this.set("fileUploadProgress",pc+"%");
            }
        }else{
            this.resetFileUploadProgressMap();
        }
   },
   resetFileUploadProgressMap(){
        this.set("uploadingFileMap",Ember.Map.create({}));
        this.set("fileUploadProgress","100%");
   }
});
