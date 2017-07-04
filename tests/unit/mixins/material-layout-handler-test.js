import Ember from 'ember';
import MaterialLayoutHandlerMixin from 'wb-ui-md-components/mixins/material-layout-handler';
import { module, test } from 'qunit';

module('Unit | Mixin | material layout handler');

// Replace this with your real tests.
test('it works', function(assert) {
  let MaterialLayoutHandlerObject = Ember.Object.extend(MaterialLayoutHandlerMixin);
  let subject = MaterialLayoutHandlerObject.create();
  assert.ok(subject);
});
