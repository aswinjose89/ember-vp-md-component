import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-header-section-toolbar-item', 'Integration | Component | header section toolbar item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-header-section-toolbar-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#wb-md-header-section-toolbar-item}}
      template block text
    {{/wb-md-header-section-toolbar-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
