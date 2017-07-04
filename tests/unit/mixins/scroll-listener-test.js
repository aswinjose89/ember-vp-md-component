import Ember from 'ember';
import ScrollListenerMixin from 'wb-ui-md-components/mixins/scroll-listener';
import { module, test } from 'qunit';

module('Unit | Mixin | scroll listener');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScrollListenerObject = Ember.Object.extend(ScrollListenerMixin);
  let subject = ScrollListenerObject.create();
  assert.ok(subject);
});
