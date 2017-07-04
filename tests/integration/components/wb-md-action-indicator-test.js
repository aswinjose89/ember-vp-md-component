import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-action-indicator', 'Integration | Component | wb md action indicator', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-action-indicator}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-action-indicator}}
      template block text
    {{/wb-md-action-indicator}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
