import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-checkbox-menu', 'Integration | Component | wb md checkbox menu', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-checkbox-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-checkbox-menu}}
      template block text
    {{/wb-md-checkbox-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});