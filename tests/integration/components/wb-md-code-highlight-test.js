import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-code-highlight', 'Integration | Component | wb md code highlight', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-code-highlight}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-code-highlight}}
      template block text
    {{/wb-md-code-highlight}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
