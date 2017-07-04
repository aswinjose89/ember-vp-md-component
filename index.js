/* jshint node: true */
'use strict';
var path = require('path'), fs = require('fs');

module.exports = {
    name: 'wb-ui-md-components',
    treeFor: function (type) {
        var pkgPath = path.join(process.cwd(), 'package.json'),
              pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf-8' })),
              env = process.env.EMBER_ENV || 'development', tree;
        if (env === 'production') {
            if (pkg.includeDevDepsAddonInProdBuild === true) {
                return tree = this._super.treeFor.apply(this, [type]);
            }
        } else {
            return tree = this._super.treeFor.apply(this, [type]);
        }
    },
    included: function (app) {
        this._super.included(app);
    },
    isDevelopingAddon: function() {
        return true;
    }
};
