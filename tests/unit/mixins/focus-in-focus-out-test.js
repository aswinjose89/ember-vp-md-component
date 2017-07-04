import Ember from 'ember';
import FocusInFocusOutMixin from 'wb-ui-md-components/mixins/focus-in-focus-out';
import { module, test } from 'qunit';

module('Unit | Mixin | focus in focus out');

// Replace this with your real tests.
test('it works', function(assert) {
  let FocusInFocusOutObject = Ember.Object.extend(FocusInFocusOutMixin);
  let subject = FocusInFocusOutObject.create();
  assert.ok(subject);
});
