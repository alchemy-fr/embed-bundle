<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\EmbedProvider;

use Alchemy\Embed\Embed\EmbedController;
use Alchemy\Embed\Oembed\OEmbedController;
use Alchemy\Phrasea\Controller\LazyLocator;
use Silex\Application;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Silex\ServiceProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Twig_Environment;

class EmbedServiceProvider implements ServiceProviderInterface, ControllerProviderInterface
{
    public function register(Application $app)
    {
        $app['alchemy_embed.controller.embed'] = $app->share(
          function (Application $app) {
              return (new EmbedController($app, $app->getApplicationBox(), $app['acl'], $app->getAuthenticator()))
                ->setDataboxLoggerLocator($app['phraseanet.logger'])
                ->setDelivererLocator(new LazyLocator($app, 'phraseanet.file-serve'));
          }
        );

        $app['twig.loader.filesystem'] = $app->share(
          $app->extend('twig.loader.filesystem', function (\Twig_Loader_Filesystem $loader) {
              $loader->addPath(__DIR__.'/../../views', 'alchemy_embed');

              return $loader;
          }));
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
          ->assert('sbas_id', '\d+')
          ->assert('record_id', '\d+');

        // http://phraseanet-php55-nginx/index_dev.php/embed/1/46/preview/FTV_VOEUX2015_BD_preview.mp4?token=rxszUQMMQDFPs1xAsvrz2sHzduUnvieYsSbG6XoEYFAJAo34EEsjMP8CRaJceUKY
        $controllers->get('/{sbas_id}/{record_id}/{subdefName}/', 'alchemy_embed.controller.embed:viewAction')
          ->bind('alchemy_embed_view');

        $controllers->match('/{sbas_id}/{record_id}/{subdefName}/', 'alchemy_embed.controller.embed:optionsAction')
          ->method('OPTIONS');


        $controllers->get('/iframe/{sbas_id}/{record_id}/{subdefName}/', 'alchemy_embed.controller.embed:testIframeAction')
          ->bind('alchemy_embed_iframe');



        return $controllers;
    }
}
