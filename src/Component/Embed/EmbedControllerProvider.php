<?php

namespace Alchemy\Embed\Embed;

use Alchemy\Phrasea\Authentication\Authenticator;
use Alchemy\Phrasea\Core\Event\Listener\OAuthListener;
use Silex\Application;
use Silex\ControllerCollection;
use Silex\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;

class EmbedControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers
          ->get('/', 'alchemy_embed.controller.embed:indexAction')
          ->bind('alchemy_embed_index');

        return $controllers;
    }
}
