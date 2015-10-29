let instance = null;
import * as _ from 'underscore';

export default class ApplicationConfigService {
    configuration;

    constructor(config) {
        // if( !instance ) {
        //     instance = this;
        // }
        this.configuration = config;
        // return instance;
    }

    get(configKey) {
        if (configKey !== undefined) {
            var foundValue = this._findKeyValue(configKey || this.configuration);
            switch (typeof foundValue) {
                case 'string':
                    return foundValue;
                default:
                    return foundValue ? foundValue : null;

            }

        }

        return this.configuration;
    }

    set(configKey, value) {
        if (configKey !== undefined) {
            this.configuration[configKey] = value;
        }
    }

    // @TODO cast
    _findKeyValue(configName) {
        if (!configName) {
            return undefined;
        }

        var isStr = (<any>_).isString(configName),
            name  = isStr ? configName : configName.name,
            path  = configName.indexOf('.') > 0 ? true : false;

        if (path) {
            return this._search(this.configuration, name);

        }
        var state = this.configuration[name];
        if (state && (isStr || (!isStr && state === configName))) {
            return state;
        } else if ( isStr ) {
            return state;
        }
        return undefined;
    }

    // @TODO cast
    _search(obj, path) {
        if ((<any>_).isNumber(path)) {
            path = [path];
        }
        if ((<any>_).isEmpty(path)) {
            return obj;
        }
        if ((<any>_).isEmpty(obj)) {
            return null;
        }
        if ((<any>_).isString(path)) {
            return this._search(obj, path.split('.'));
        }

        var currentPath = path[0];

        if (path.length === 1) {
            if (obj[currentPath] === void 0) {
                return null;
            }
            return obj[currentPath];
        }

        return this._search(obj[currentPath], path.slice(1));
    }
};