import * as _ from 'underscore';
import ApplicationConfigService from '../core/applicationConfigService';
//import radioChannels from '../../core/radioChannels';
import config from './config';

let instance = null;

class ConfigService extends ApplicationConfigService{
    constructor() {
        super(config);

        if ( !instance ) {
            instance = this;
        }

/*        // register listeners:
        radioChannels().get('config').reply('service', () => {
            return instance;
        });
        radioChannels().get('config').reply('get', (configKey) => {
            return this.get(configKey);
        });*/

        return instance;
    }
};

export default ConfigService;