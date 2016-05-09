
__karma__.loaded = function () { };

System.config({
    baseURL: '/base',
    transpiler: 'typescript',
    typescriptOptions: {
        module: 'system',
        emitDecoratorMetadata: true,
        experimentalDecorators: true
    },
    packages: {
        'test': { defaultExtension: 'ts' },
        'src': { defaultExtension: 'ts' },
        '@angular/common': { main: 'index.js', defaultExtension: 'js' },
        '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
        '@angular/core': { main: 'index.js', defaultExtension: 'js' },
        '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
        '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
        '@angular/router': { main: 'index.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
    },
    map: {
        '@angular/common': 'node_modules/@angular/common',
        '@angular/compiler': 'node_modules/@angular/compiler',
        '@angular/core': 'node_modules/@angular/core',
        '@angular/platform-browser': 'node_modules/@angular/platform-browser',
        '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic',
        '@angular/router': 'node_modules/@angular/router',
        'rxjs': 'node_modules/rxjs'
    }
});

System.import('@angular/core/testing')
    .then(function (coreTesting) {
        return System.import('@angular/platform-browser-dynamic/testing')
            .then(function (browserTesting) {
                coreTesting.setBaseTestProviders(
                    browserTesting.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
                    browserTesting.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
                );
            });
    })
    .then(function () { return System.import('test/ng2-bs3-modal.spec'); })
    .then(function () { __karma__.start(); }, null, function (error) { __karma__.error(error.stack || error); });