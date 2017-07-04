import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-icon-toolbar', 'Integration | Component | wb md icon toolbar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-icon-toolbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-icon-toolbar}}
      template block text
    {{/wb-md-icon-toolbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
