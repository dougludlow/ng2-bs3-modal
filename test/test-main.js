
Error.stackTraceLimit = 0;
// Error.stackTraceLimit = Infinity;

__karma__.loaded = function () { };

System.config({
    transpiler: 'typescript',
    baseURL: '/base',
    packages: {
        'test': { defaultExtension: 'ts' },
        'src': { defaultExtension: 'ts' },
        '@angular/common': { main: 'index.js', defaultExtension: 'js' },
        '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
        '@angular/core': { main: 'index.js', defaultExtension: 'js' },
        '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
        '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
        '@angular/router': { main: 'index.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' }
    },
    map: {
        '@angular/common': 'node_modules/@angular/common',
        '@angular/compiler': 'node_modules/@angular/compiler',
        '@angular/core': 'node_modules/@angular/core',
        '@angular/platform-browser': 'node_modules/@angular/platform-browser',
        '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic',
        '@angular/router': 'node_modules/@angular/router',
        '@angular/core/testing': 'node_modules/@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'node_modules/@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'node_modules/@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'node_modules/@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'node_modules/@angular/forms/bundles/forms-testing.umd.js',
        'rxjs': 'node_modules/rxjs',
        'zone.js': 'node_modules/zone.js',
    }
});

System.import('@angular/core/testing')
    .then(function (coreTesting) {
        return System.import('@angular/platform-browser-dynamic/testing')
            .then(function (browserTesting) {
                coreTesting.TestBed.initTestEnvironment(
                    browserTesting.BrowserDynamicTestingModule,
                    browserTesting.platformBrowserDynamicTesting());
            });
    })
    .then(function () { return System.import('test/ng2-bs3-modal.spec'); })
    .then(__karma__.start, null, function (error) { __karma__.error(error.stack || error); });