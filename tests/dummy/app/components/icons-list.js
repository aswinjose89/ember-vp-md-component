import Ember from 'ember';
import layout from '../templates/components/icons-list';
import copyToClipBoard from 'wb-ui-md-components/utils/copy-to-clip-board';

export default Ember.Component.extend({
    layout,
    didSearchKeyChanged: Ember.observer('searchKey', function(){
        this.get('iconsList').forEach( icon => icon.set('isHidden', (icon.get('ligatures').indexOf(this.get('searchKey')) === -1)) );
    }),
    actions: {
        copyName: function (name) {
            copyToClipBoard(name);
        }
    }
});
