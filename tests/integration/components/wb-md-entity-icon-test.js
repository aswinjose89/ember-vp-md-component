import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-entity-icon', 'Integration | Component | wb md entity icon', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-entity-icon}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-entity-icon}}
      template block text
    {{/wb-md-entity-icon}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
