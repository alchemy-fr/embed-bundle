<?php

namespace Alchemy\Embed\Oembed;

use Alchemy\Embed\Controller\BaseController;
use Alchemy\Phrasea\Application;
use Alchemy\Phrasea\Authentication\ACLProvider;
use Alchemy\Phrasea\Authentication\Authenticator;
use Symfony\Component\HttpFoundation\Request;

class OembedController extends BaseController
{
    /** @var ACLProvider */
    private $acl;
    /** @var \appbox */
    private $appbox;
    /** @var Authenticator */
    private $authentication;

    public function __construct(Application $app, \appbox $appbox, ACLProvider $acl, Authenticator $authenticator)
    {
        parent::__construct($app);

        $this->appbox = $appbox;
        $this->acl = $acl;
        $this->authentication = $authenticator;
    }

    public function indexAction(Request $request)
    {
        var_dump($request->get('url'));exit;
        $view = '@alchemy_embed/embed/view.html.twig';
        return $this->render($view, [
          'aa' => ''
        ]);


    }

    public function viewAction(Request $request)
    {
        $view = '@alchemy_embed/embed/view.html.twig';
        return $this->render($view, [
          'aa' => ''
        ]);

    }
}
