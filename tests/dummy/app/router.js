import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('direct', { path: '/' });
  this.route('partial');
  this.route('x-partial');
});

export default Router;
