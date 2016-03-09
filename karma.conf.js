/* global module */
module.exports = function (config) {
    'use strict';
    config.set({

        basePath: '.',
        singleRun: false,
        frameworks: ['jasmine'],
        reporters: ['spec'],
        //browsers: ['PhantomJS2'],
        browsers: ['Chrome'],
        files: [
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',   
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/typescript/lib/typescript.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/testing.dev.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'test/test-main.js',
            { pattern: 'src/**/*.ts', included: false, served: true },
            { pattern: 'test/**/*.ts', included: false, served: true }
        ]
    });
};