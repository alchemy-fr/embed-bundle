<?php
namespace Alchemy\EmbedProvider;

use Alchemy\Embed\Oembed\OembedController;
use Alchemy\Phrasea\Controller\LazyLocator;
use Silex\Application;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Silex\ServiceProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Twig_Environment;

class OembedServiceProvider implements ServiceProviderInterface, ControllerProviderInterface
{
    public function register(Application $app)
    {
        $app['alchemy_embed.controller.oembed'] = $app->share(
          function (Application $app) {
              return (new OembedController($app, $app->getApplicationBox(), $app['acl'], $app->getAuthenticator()))
                ->setDataboxLoggerLocator($app['phraseanet.logger'])
                ->setDelivererLocator(new LazyLocator($app, 'phraseanet.file-serve'));
          }
        );
    }

    public function boot(Application $app)
    {
        // Nothing to do.
    }

    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers
          ->get('/', 'alchemy_embed.controller.oembed:indexAction');
          // ->bind('alchemy_oembed_index');
/*

        $controllers
          ->assert('sbas_id', '\d+')
          ->assert('record_id', '\d+');

        $controllers->get('/{sbas_id}/{record_id}/{subdefName}/{label}', 'alchemy_embed.controller.embed:viewAction')
          ->bind('alchemy_embed_view');

        $controllers->match('/{sbas_id}/{record_id}/{subdefName}/{label}', 'alchemy_embed.controller.embed:optionsAction')
          ->method('OPTIONS');
        */

        // http://phraseanet-php55-nginx/index_dev.php/oembed/?url=http%3A%2F%2Fphraseanet-php55-nginx%2Findex_dev.php%2Fembed%2F1%2F46%2Fpreview%2FFTV_VOEUX2015_BD_preview.mp4%3Ftoken%3DrxszUQMMQDFPs1xAsvrz2sHzduUnvieYsSbG6XoEYFAJAo34EEsjMP8CRaJceUKY


        return $controllers;
    }
}
