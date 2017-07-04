import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wb-md-content-toolbar-row', 'Integration | Component | wb md content toolbar row', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{wb-md-content-toolbar-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    <div class="content-toolbar__row">
      template block text
    </div>
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
