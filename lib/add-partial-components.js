/* eslint-env node */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const Plugin = require('broccoli-plugin');
const BroccoliMergeTrees = require('broccoli-merge-trees');

module.exports = function addPartialComponents(tree, options) {
  return new BroccoliMergeTrees([tree, new AddPartialComponents(options)]);
};

class AddPartialComponents extends Plugin {
  constructor(options) {
    super([], options);
    this.addon = options.addon;

    this.template = fs.readFileSync(path.join(__dirname, 'x-partial-template.js'), 'utf-8');
  }

  build() {
    let allPartials = new Set();

    Object.keys(this.addon.xPartialUsage).forEach(templateFile => {
      let xPartials = this.addon.xPartialUsage[templateFile];
      xPartials.forEach(value => allPartials.add(value));
    });

    allPartials.forEach(partial => {
      // Converting "${partial}" partial to "x-partial-${partial}" component ...

      let filePath = path.join(this.outputPath, this.addon.app.name, 'components', `x-partial-${partial}.js`);

      let content = this.template.replace(/%%partial%%/g, partial);

      fs.outputFileSync(filePath, content, 'utf-8');
    })
  }
}
