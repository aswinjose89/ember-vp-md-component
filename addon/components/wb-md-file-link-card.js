import Ember from 'ember';
import layout from '../templates/components/wb-md-file-link-card';

export default Ember.Component.extend({
  layout: layout,
  showMore : false,
  showLength : 200,
  showTrigger : false,
  readOnly: true,
  fileCategoryLabel: "Category",
  fileDescriptionLabel: "Description",
   init() {
        this._super(...arguments);
        var file = this.get('file');
        if(!Ember.isEmpty(file)){
	        if (this.get('showLength') < this.get('file.description').length) {
	            this.set('showMore', false);
	            this.set('showTrigger',true);
	        }else {
	            this.set('showMore', true);
	        }
        }
    }
});
