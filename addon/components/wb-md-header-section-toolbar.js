import Ember from 'ember';
import layout from '../templates/components/wb-md-header-section-toolbar';
import ComponentHelper from '../mixins/component-helper';


const {
  computed
} = Ember;

const {
   alias
} = computed;

export default Ember.Component.extend(ComponentHelper,{
  layout,
  tagName: 'ul',
  classNames: ['global-icon-toolbar'],
  //including Action menu
  toolBarVisibleItems : 4,
  iconsItemsLength : alias('items.length'),
  iconsForToolbar: [],
  iconsForActionMenu: null,

  init(){
    this._super(...arguments);
    this.setupConfig(this.get('config'));
    if(this.get('iconsItemsLength') > this.get('toolBarVisibleItems')) {
		this.set('iconsForToolbar', this.get('items').slice(0, this.get('toolBarVisibleItems')-1));
		this.setProperties({
	        "iconsForActionMenu": {
	          "items": this.get('items').slice(this.get('toolBarVisibleItems')-1, this.get('iconsItemsLength')),
	          "position": this.get('position')
	        }
		});
	} else {
		this.set('iconsForToolbar', this.get('items'));
	}
  },
  actions:{
      menuAction(actionName) {
        this.sendAction("menuAction", actionName);
      },
      clickAction(actionName) {
        this.sendAction("clickAction", actionName);
      }
  }
});
