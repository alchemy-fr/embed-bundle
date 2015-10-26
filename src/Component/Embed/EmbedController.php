<?php

namespace Alchemy\Embed\Embed;

use Alchemy\Embed\Controller\BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class EmbedController extends BaseController
{
    public function indexAction(Request $request)
    {
        $view = '@embed/embed/view.html.twig';
        return $this->render($view, [
        ]);


    }

    public function viewAction(Request $request)
    {
        $view = 'web-gallery/view.html.twig';
        return $this->render(sprintf('@%s/%s', '', $view), [
        ]);
    }
}
