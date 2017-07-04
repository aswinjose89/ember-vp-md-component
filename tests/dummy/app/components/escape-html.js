import Ember from 'ember';
import layout from '../templates/components/escape-html';

export default Ember.Component.extend({
    layout,
    didInsertElement: function() {
        var value = this.$('.to-escape').html();
        this.$('code').text(value);
    }
});
