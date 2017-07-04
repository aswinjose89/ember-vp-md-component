import Ember from 'ember';
import ComponentHelperMixin from 'wb-ui-md-components/mixins/component-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | component helper');

// Replace this with your real tests.
test('it works', function(assert) {
  let ComponentHelperObject = Ember.Object.extend(ComponentHelperMixin);
  let subject = ComponentHelperObject.create();
  assert.ok(subject);
});
