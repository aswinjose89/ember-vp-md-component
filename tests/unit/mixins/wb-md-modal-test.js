import Ember from 'ember';
import WbMdModalMixin from 'wb-ui-md-components/mixins/wb-md-modal';
import { module, test } from 'qunit';

module('Unit | Mixin | wb md modal');

// Replace this with your real tests.
test('it works', function(assert) {
  let WbMdModalObject = Ember.Object.extend(WbMdModalMixin);
  let subject = WbMdModalObject.create();
  assert.ok(subject);
});
