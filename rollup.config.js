import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'ng2-bs3-modal.js',
    output: {
        file: 'bundles/ng2-bs3-modal.umd.js', // output a single application bundle
        format: 'umd'
    },
    sourceMap: false,
    name: 'ng2-bs3-modal',
    onwarn: function (warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }
        // intercepts in some rollup versions
        if (warning.message.indexOf("The 'this' keyword is equivalent to 'undefined'") > -1) {
            return;
        }

        // console.warn everything else
        console.warn(warning.message);
    },
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Observable',
        'rxjs/Subject',
        'rxjs/add/observable/fromEvent',
        'rxjs/add/observable/merge',
        'rxjs/add/observable/of',
        'rxjs/add/observable/zip',
        'rxjs/add/operator/do',
        'rxjs/add/operator/filter',
        'rxjs/add/operator/map',
        'rxjs/add/operator/partition',
        'rxjs/add/operator/share',
        'rxjs/add/operator/startWith',
        'rxjs/add/operator/take',
        'rxjs/add/operator/toPromise'
    ],
    globals: {
        // Angular dependencies
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',

        // Rxjs dependencies
        'rxjs/Observable': 'Rx',
        'rxjs/Subject': 'Rx',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/merge': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable',
        'rxjs/add/observable/zip': 'Rx.Observable',
        'rxjs/add/operator/do': 'Rx.Observable.prototype',
        'rxjs/add/operator/filter': 'Rx.Observable.prototype',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/partition': 'Rx.Observable.prototype',
        'rxjs/add/operator/share': 'Rx.Observable.prototype',
        'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
        'rxjs/add/operator/take': 'Rx.Observable.prototype',
        'rxjs/add/operator/toPromise': 'Rx.Observable.prototype'
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs()
    ]
}
