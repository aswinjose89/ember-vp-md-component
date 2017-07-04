import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('table/column-filter', 'Integration | Component | table/column filter', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{table/column-filter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#table/column-filter}}
      template block text
    {{/table/column-filter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
