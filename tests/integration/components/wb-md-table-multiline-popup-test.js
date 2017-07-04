import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-table-multiline-popup', 'Integration | Component | wb md table multiline popup', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs `{{wb-md-table-multiline-popup}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs `
    {{#wb-md-table-multiline-popup}}
      template block text
    {{/wb-md-table-multiline-popup}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});