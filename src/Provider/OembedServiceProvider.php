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

        return $controllers;
    }
}
