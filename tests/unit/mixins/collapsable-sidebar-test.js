import Ember from 'ember';
import CollapsableSidebarMixin from 'wb-ui-md-components/mixins/collapsable-sidebar';
import { module, test } from 'qunit';

module('Unit | Mixin | collapsable sidebar');

// Replace this with your real tests.
test('it works', function(assert) {
  let CollapsableSidebarObject = Ember.Object.extend(CollapsableSidebarMixin);
  let subject = CollapsableSidebarObject.create();
  assert.ok(subject);
});
