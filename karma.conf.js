// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-spec-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            //clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        files: [
            { pattern: './src/test/test.ts', watched: false },
        ],
        preprocessors: {
            './src/test/test.ts': ['@angular-devkit/build-angular']
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: config.angularCli && config.angularCli.codeCoverage ?
            ['spec', 'coverage-istanbul'] :
            ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            // 'Chrome',
            'ChromeHeadless'
        ],
        singleRun: false,
    });
};
