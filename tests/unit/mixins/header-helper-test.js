import Ember from 'ember';
import HeaderHelperMixin from 'wb-ui-md-components/mixins/header-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | header helper');

// Replace this with your real tests.
test('it works', function(assert) {
  let HeaderHelperObject = Ember.Object.extend(HeaderHelperMixin);
  let subject = HeaderHelperObject.create();
  assert.ok(subject);
});
