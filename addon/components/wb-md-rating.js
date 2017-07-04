import Ember from 'ember';
import layout from '../templates/components/wb-md-rating';

export default Ember.Component.extend({
    layout,
    classNames: ['rating-block'],
    classNameBindings: [
        'setCurrentRating',
        'readOnly:rating-block_read-only'
    ],
    maxRating: 7,
    currentRating: 0,
    readOnly: false,
    ratingArray: Ember.computed('maxRating', function () {
        return new Array(this.get('maxRating')).join().split(',').map(function (item, index) {
            return ++index;
        });
    }),
    setCurrentRating: Ember.computed('currentRating', function () {
        return 'rating-block_'+this.get('currentRating');
    }),
    init(){
        this._super(...arguments);
    },
    actions: {
        changeRating(index){
            this.set('currentRating', index);
            if(this.get('onChange')){
                this.get('onChange')(this.get('currentRating'));
            }
        }
    }
});
