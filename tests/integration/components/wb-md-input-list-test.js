import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-input-list', 'Integration | Component | wb md input list', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-input-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-input-list}}
      template block text
    {{/wb-md-input-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
