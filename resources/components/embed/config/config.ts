import * as _ from 'underscore';

let config = {
    assetsPath: '/plugins/web-gallery/assets',
    api: {
        baseUrl: '/web-gallery',
        basePath: '',
        ajaxSetup: {
            accept: 'application/json',
            contentType: 'application/json',
            async: true,
            cache: false,
            dataType: 'json',
            complete: () => {
                // console.log('complete')
            },
            error: (jqXHR, textStatus, errorThrown) => {
                // override default phraseanet behavior
                console.log('ajax failed', jqXHR, textStatus, errorThrown)
                var res, ct = jqXHR.getResponseHeader('content-type') || '';
                if (ct.indexOf('json') > -1) {
                    res = $.parseJSON(jqXHR.responseText);
                    // process the response here
                }

                return  res;
            }
        }
    }
};

// config can be overridden by local environment:
let envConfiguration = (<any>window).envConfiguration;
if( envConfiguration !== undefined ) {
    config = _.extend(config, envConfiguration);
}

export default config;