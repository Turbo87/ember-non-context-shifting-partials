define('dummy/components/x-partial-%%partial%%', ['exports', 'dummy/templates/%%partial%%'], function (exports, _layout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = Ember.Component.extend({
    layout: _layout.default,
    tagName: ''
  });
});
