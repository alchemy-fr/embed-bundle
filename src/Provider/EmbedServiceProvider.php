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

use Alchemy\Embed\Embed\Embed;
use Alchemy\Embed\Embed\EmbedController;
use Alchemy\Embed\Media\ChainedResourceResolver;
use Alchemy\Embed\Media\Media;
use Alchemy\Phrasea\Application;
use Silex\Application as SilexApplication;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Silex\ServiceProviderInterface;

class EmbedServiceProvider implements ServiceProviderInterface, ControllerProviderInterface
{
    public function register(SilexApplication $app)
    {
        $app['alchemy_embed.resource_resolvers'] = new \Pimple();
        $app['alchemy_embed.resource_resolver'] = $app->share(function (Application $app) {
            return new ChainedResourceResolver($app['alchemy_embed.resource_resolvers']);
        });

        $app['alchemy_embed.controller.embed'] = $app->share(
            function (Application $app) {
                return new EmbedController(
                    $app,
                    $app['alchemy_embed.service.media'],
                    $app['alchemy_embed.service.embed']
                );
            }
        );

        $app['alchemy_embed.service.embed'] = $app->share(
            function (Application $app) {
                return new Embed($app['phraseanet.configuration']['embed_bundle']);
            }
        );

        $app['alchemy_embed.service.media'] = $app->share(
            function (Application $app) {
                return new Media($app);
            }
        );

        $app['twig.loader.filesystem'] = $app->share(
            $app->extend('twig.loader.filesystem', function (\Twig_Loader_Filesystem $loader) {
                $loader->addPath(__DIR__.'/../../views', 'alchemy_embed');

                return $loader;
            })
        );
    }

    public function boot(SilexApplication $app)
    {
        // Nothing to do.
    }

    public function connect(SilexApplication $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('/', 'alchemy_embed.controller.embed:viewAction')
            ->assert('url', '.*')
            ->bind('alchemy_embed_view');

        $controllers->get('/vtt/', 'alchemy_embed.controller.embed:viewVttAction')
          ->assert('url', '.*')
          ->bind('alchemy_embed_view_vtt');

        $controllers
            ->get('/oembed/', 'alchemy_embed.controller.embed:oembedAction')
            ->assert('url', '.*')
            ->bind('alchemy_embed_oembed');

        return $controllers;
    }
}
