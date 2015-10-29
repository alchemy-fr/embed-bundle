var gutil = require("gulp-util");
var fs = require('fs');
var path = require('path');
var configPaths = {
    src: './resources',
    tmp: './.tmp',
    dist: '../../../www/assets/embed',
    baseClientConfig: 'resources/themes/default',
    useClientConfig: 'DISABLED'
};
exports.taskNamespace = 'view';
exports.paths = configPaths;

exports.checkDistPath = function() {
    "use strict";
    try {
        fs.statSync(path.resolve(configPaths.dist) );
        return true;
    } catch(e) {
        gutil.log(gutil.colors.red('[ERROR]'), 'Dist folder "'+configPaths.dist+'" not found');
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
        gutil.log(gutil.colors.red('[WARNING]'), 'Client Config folder "'+configPaths.useClientConfig+'" not found');
        gutil.log(gutil.colors.yellow('[WARNING]'), 'Client Config fallback to: "'+configPaths.baseClientConfig+'"');
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