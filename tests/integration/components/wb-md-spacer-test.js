import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-spacer', 'Integration | Component | wb md spacer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-spacer}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-spacer}}
      template block text
    {{/wb-md-spacer}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
