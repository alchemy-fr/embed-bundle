<?php
namespace Alchemy\EmbedProvider;

use Alchemy\Embed\Embed\EmbedController;
use Alchemy\Embed\Response\ExceptionTransformer\DefaultExceptionTransformer;
use Alchemy\EmbedBundle\EventListener\ExceptionListener;
use Silex\Application;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Silex\ServiceProviderInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;

class EmbedProvider implements ServiceProviderInterface, ControllerProviderInterface
{
    public function register(Application $app)
    {
        $app['alchemy_embed.debug'] = false;
        $this->registerExceptionListener($app);

        $this->registerMiddlewareFactories($app);

        $app['dispatcher'] = $app->share(
            $app->extend('dispatcher', function (EventDispatcherInterface $dispatcher) use ($app) {
                $this->bindRequestListeners($app, $dispatcher);
                $this->bindResultListeners($app, $dispatcher);

                // Bind exception
                $dispatcher->addSubscriber($app['alchemy_embed.exception_listener']);
                // This block must be called after all other result listeners

                return $dispatcher;
            })
        );
        $app['alchemy_embed.root'] = $this;
        $this->registerControllers($app);
    }

    private function bindRequestListeners(Application $app, EventDispatcherInterface $dispatcher)
    {
        // dispatcher->addSubscriber($app['alchemy_embed.']);
    }

    private function bindResultListeners(Application $app, EventDispatcherInterface $dispatcher)
    {
        // dispatcher->addSubscriber($app['alchemy_embed.']);
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
          ->get('/view/{recordId}', 'alchemy_embed.controller.embed:viewAction')
          ->bind('alchemy_embed_view');

        return $controllers;
    }

    /**
     * @param Application $app
     */
    private function registerControllers(Application $app)
    {
        $app['alchemy_embed.controller.embed'] = $app->share(
          function (PhraseaApplication $app) {
              return new EmbedController($app);
          }
        );
        $providers = [
          ['/embed/view', 'alchemy_embed.controller.embed'],
          ['/embed', 'alchemy_embed.root'],
        ];
        foreach ($providers as $provider) {
            $app['plugin.controller_providers.root'][] = $provider;
        }
    }


    private function registerMiddlewareFactories(Application $app)
    {
        // Nothing to do.
    }

    private function registerExceptionListener(Application $app)
    {
        $app['alchemy_embed.exception_transformer'] = $app->share(function () use ($app) {
            return new DefaultExceptionTransformer($app['alchemy_embed.debug']);
        });
    }
}
