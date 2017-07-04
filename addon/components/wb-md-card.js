import Ember from 'ember';
import layout from '../templates/components/wb-md-card';

export default Ember.Component.extend({
    layout,
    tagName: 'article',
    classNames: ['card'],
    classNameBindings: ['cardType'],
    cardType: Ember.computed('type', function () {
        if(!Ember.isEmpty(this.get('type'))){
            return 'card_type_'+this.get('type');
        }
    })
});
