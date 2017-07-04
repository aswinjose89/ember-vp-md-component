import Ember from 'ember';
import layout from '../templates/components/async-button';

export default Ember.Component.extend({
  layout,
  init() {
      this._super.apply(this, arguments);
      this.setProperties({
          timeoutLength: 500,
          rejectPromise: false
      });
  },
  actions: {
      save: function (callback) {
          var self = this;
          var promise = new Ember.RSVP.Promise(function (resolve, reject) {
              if (self.get('rejectPromise')) {
                  Ember.run.later(function () {
                      reject('Promise is rejectd');
                  }, self.get('timeoutLength'));
              } else {
                  Ember.run.later(function () {
                      resolve();
                  }, self.get('timeoutLength'));
              }
          });
          callback(promise);
      },
      saveWithClosureAction(){
          var self = this;
          return new Ember.RSVP.Promise(function (resolve, reject) {
              if (self.get('rejectPromise')) {
                  Ember.run.later(function () {
                      reject('Promise is rejectd');
                  }, self.get('timeoutLength'));
              } else {
                  Ember.run.later(function () {
                      resolve();
                  }, self.get('timeoutLength'));
              }
          });
      }
  }
});
