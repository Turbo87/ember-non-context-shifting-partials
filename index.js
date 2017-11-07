/* eslint-env node */

'use strict';

const buildAstTransform = require('./lib/ast-transform');

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
};
