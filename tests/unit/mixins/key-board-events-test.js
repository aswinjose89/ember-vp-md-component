import Ember from 'ember';
import KeyBoardEventsMixin from 'wb-ui-md-components/mixins/key-board-events';
import { module, test } from 'qunit';

module('Unit | Mixin | key board events');

// Replace this with your real tests.
test('it works', function(assert) {
  let KeyBoardEventsObject = Ember.Object.extend(KeyBoardEventsMixin);
  let subject = KeyBoardEventsObject.create();
  assert.ok(subject);
});
