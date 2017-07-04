/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
    var app = new EmberApp(defaults, {
        fingerprint: {
            customHash: '1.0.0'
        },
        autoprefixer: {
            browsers: ['IE > 10', 'last 2 Firefox versions', 'last 2 Chrome versions', 'last 2 Safari versions']
        }
    });

    // Shim is required since bind function is not available in phantomjs.
    app.import(app.bowerDirectory + '/es5-shim/es5-shim.js', { type: 'test' });
    app.import(app.bowerDirectory + '/jquery-mockjax/jquery.mockjax.js', { type: 'test' });
    // app.import(app.bowerDirectory + '/sinon/index.js', { type: 'test' });

    return app.toTree();
};
