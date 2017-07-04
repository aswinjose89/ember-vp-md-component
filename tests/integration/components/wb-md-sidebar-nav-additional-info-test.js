import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-sidebar-nav-additional-info', 'Integration | Component | sidebar nav additional info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-sidebar-nav-additional-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-sidebar-nav-additional-info}}
      template block text
    {{/wb-md-sidebar-nav-additional-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
