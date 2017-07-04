/* globals blanket, module */

var options = {
    modulePrefix: 'wb-ui-md-components',
    filter: '//.*wb-ui-md-components/.*/',
    antifilter: '//.*(tests|template).*/',
    loaderExclusions: [],
    enableCoverage: true,
    cliOptions: {
        reporters: ['json'],
        autostart: true
    }
};
if (typeof exports === 'undefined') {
    blanket.options(options);
} else {
    module.exports = options;
}
