import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'ng2-bs3-modal.js',
    dest: 'bundles/ng2-bs3-modal.umd.js', // output a single application bundle
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng2-bs3-modal',
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
        'rxjs/Subject',
        'rxjs/add/observable/fromEvent',
        'rxjs/add/observable/forkJoin',
        'rxjs/add/observable/of',
        'rxjs/add/observable/merge',
        'rxjs/add/observable/throw',
        'rxjs/add/operator/auditTime',
        'rxjs/add/operator/toPromise',
        'rxjs/add/operator/map',
        'rxjs/add/operator/filter',
        'rxjs/add/operator/do',
        'rxjs/add/operator/share',
        'rxjs/add/operator/finally',
        'rxjs/add/operator/catch',
        'rxjs/add/operator/first',
        'rxjs/add/operator/startWith',
        'rxjs/add/operator/switchMap',
        'rxjs/Observable'
    ],
    globals: {
        // Angular dependencies
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',

        // Rxjs dependencies
        'rxjs/Subject': 'Rx',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/forkJoin': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable',
        'rxjs/add/observable/merge': 'Rx.Observable',
        'rxjs/add/observable/throw': 'Rx.Observable',
        'rxjs/add/operator/auditTime': 'Rx.Observable.prototype',
        'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/filter': 'Rx.Observable.prototype',
        'rxjs/add/operator/do': 'Rx.Observable.prototype',
        'rxjs/add/operator/share': 'Rx.Observable.prototype',
        'rxjs/add/operator/finally': 'Rx.Observable.prototype',
        'rxjs/add/operator/catch': 'Rx.Observable.prototype',
        'rxjs/add/operator/first': 'Rx.Observable.prototype',
        'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
        'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
        'rxjs/Observable': 'Rx'
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            module: true
        }),
        commonjs({
            include: 'node_modules/rxjs/**',
        })
    ]
}