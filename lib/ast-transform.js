/* eslint-env node */

'use strict';

class AstTransform {
  constructor(addon, options) {
    this.addon = addon;
    this.options = options;

    this.addon.xPartialUsage[options.moduleName] = new Set();
  }

  transform(ast) {
    let addon = this.addon;
    let options = this.options;

    this.syntax.traverse(ast, {
      MustacheStatement(node) {
        if (node.path.original === 'x-partial') {
          let partialName = node.params[0].original;
          let newName = `x-partial-${partialName}`;

          node.path.original = newName;
          node.path.parts = [newName];
          node.params = [];

          addon.xPartialUsage[options.moduleName].add(partialName);
        }
      }
    });

    return ast;
  }
}

function buildAstTransform(addon) {
  return class extends AstTransform {
    constructor(options) {
      super(addon, options);
    }
  }
}

module.exports = buildAstTransform;
