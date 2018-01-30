var gutil = require("gulp-util");
var fs = require('fs');
var path = require('path');
const _root = __dirname + '/../';
var configPaths = {
    src: './resources',
    tmp: './.tmp',
    deployParent: '../../../www/assets',
    dist: _root + 'dist',
    baseClientConfig: 'resources/themes/default',
    useClientConfig: 'your custom folder here'
};
exports.taskNamespace = 'view';
exports.paths = configPaths;

exports.checkPath = function(userPath) {
    "use strict";
    try {
        fs.statSync(path.resolve(userPath) );
        return true;
    } catch(e) {
        return false;
    }
};

/**
 * ensure external override config is accessible
 * @returns {boolean}
 */
exports.checkClientConfigPath = function() {
    "use strict";
    try {
        fs.statSync(path.resolve(configPaths.useClientConfig) );
        return true;
    } catch(e) {
        gutil.log(gutil.colors.yellow('[WARNING]'), 'Client Config folder "'+configPaths.useClientConfig+'" not found');
        gutil.log(gutil.colors.green('[INFO]'), 'Client Config fallback to: "'+configPaths.baseClientConfig+'"');
        return false;
    }
};

exports.errorHandler = function(title) {
    'use strict';

    return function(err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};