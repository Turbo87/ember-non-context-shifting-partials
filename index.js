/* eslint-env node */

'use strict';

const buildAstTransform = require('./lib/ast-transform');
const addPartialComponents = require('./lib/add-partial-components');

const name = 'ember-non-context-shifting-partials';

module.exports = {
  name,

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      registry.add('htmlbars-ast-plugin', {
        name,
        plugin: buildAstTransform(this),
        baseDir() { return __dirname; }
      });
    }
  },

  included(app, parentAddon) {
    this.xPartialUsage = {};

    // Quick fix for add-on nesting
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && (app.app || app.parent)) {
      app = app.app || app.parent;
    }

    // if app.import and parentAddon are blank, we're probably being consumed by an in-repo-addon
    // or engine, for which the "bust through" technique above does not work.
    if (typeof app.import !== 'function' && !parentAddon) {
      if (app.registry && app.registry.app) {
        app = app.registry.app;
      }
    }

    if (!parentAddon && typeof app.import !== 'function') {
      throw new Error(`${name} is being used within another addon or engine and is having trouble registering itself to the parent application.`);
    }

    this.app = app;

    // https://github.com/ember-cli/ember-cli/issues/3718#issuecomment-88122543
    this._super.included.call(this, app);
  },

  postprocessTree(type, tree) {
    if (type === 'js') {
      return addPartialComponents(tree, { addon: this });
    }
    return tree;
  },
};
