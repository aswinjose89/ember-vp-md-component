import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-table-cell-list', 'Integration | Component | wb md table cell list', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-table-cell-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-table-cell-list}}
      template block text
    {{/wb-md-table-cell-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
