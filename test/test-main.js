
__karma__.loaded = function () { };

System.config({
    transpiler: 'typescript',
    typescriptOptions: {
        module: 'system',
        emitDecoratorMetadata: true,
        experimentalDecorators: true
    },
    packages: {
        'base/test': { defaultExtension: 'ts' },
        'base/src': { defaultExtension: 'ts' }
    }
});

System.import('angular2/src/platform/browser/browser_adapter')
    .then(function(browser_adapter) { browser_adapter.BrowserDomAdapter.makeCurrent(); })
    .then(function() { return System.import('base/test/ng2-bs3-modal.spec'); })
    .then(function() { __karma__.start(); }, null, function(error) { __karma__.error(error.stack || error); });
