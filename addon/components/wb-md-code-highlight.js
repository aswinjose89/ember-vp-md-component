import Ember from 'ember';
import layout from '../templates/components/wb-md-code-highlight';

export default Ember.Component.extend({
    layout,
    className: ['code-highlight'],
    type: 'markup',
    didInsertElement(){
        let child = this.get('element').querySelector('code'),
            replaceRegex = /(<((?=[a-z])|(?=(\/))))/g;
        child.innerHTML = child.innerHTML.replace(replaceRegex, '&lt;');
    }
});
