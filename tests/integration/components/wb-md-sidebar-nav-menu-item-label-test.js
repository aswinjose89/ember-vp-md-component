import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-sidebar-nav-menu-item-label', 'Integration | Component | wb md sidebar nav menu item label', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-sidebar-nav-menu-item-label}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-sidebar-nav-menu-item-label}}
      template block text
    {{/wb-md-sidebar-nav-menu-item-label}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
