<?php
namespace Alchemy\EmbedProvider;

use Alchemy\Embed\Embed\EmbedController;
use Silex\Application;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Silex\ServiceProviderInterface;
use Symfony\Component\HttpFoundation\Request;

class EmbedServiceProvider implements ServiceProviderInterface, ControllerProviderInterface
{
    public function register(Application $app)
    {
        $app['alchemy_embed.controller.embed'] = $app->share(
          function (Application $app) {
              return new EmbedController($app);
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
          ->get('/', 'alchemy_embed.controller.embed:indexAction')
          ->bind('alchemy_embed_index');

        $controllers
          ->get('/view/{recordId}', 'alchemy_embed.controller.embed:viewAction')
          ->bind('alchemy_embed_view');

        return $controllers;
    }
}
