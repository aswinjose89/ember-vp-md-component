import Ember from 'ember';
import config from './config/environment';

var AppRouter = Ember.Router.extend({
    location: config.locationType
});

AppRouter.map(function () {
  this.route('md-components', function () {
      this.route('buttons');
      this.route('menus');
      this.route('tables', function () {
          this.route('static');
          this.route('editable');
          this.route('pageable', function () {
              this.route('default');
              this.route('loadmore');
              this.route('infinite');
          });
          this.route('nested');
          this.route('multiselect');
          this.route('actions');
      });
      this.route('inputs', function () {
          this.route('simple');
          this.route('date');
          this.route('boolean');
          this.route('dropdown');
      });
      this.route('tabs', function () {
          this.route('notab');
          this.route('tab', {
              path: "/tab/:id"
          });
          this.route('tabs', {
              path: "/tabs/:a/:b"
          });
      });
      this.route('notifications');
      this.route('icons');
      this.route('tooltips');
      this.route('tags');
      this.route('card');
      this.route('comment');
      this.route('popup');
      this.route('charts');
      this.route('attachments');
      this.route('other');
      this.route('test');
      this.route('sidebar');
      this.route('ap');
      this.route('dp');
  });

  this.route('input', function() {});
});

export default AppRouter;