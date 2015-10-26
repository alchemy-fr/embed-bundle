<?php

namespace Alchemy\Embed\Embed;


use Alchemy\Embed\Controller\BaseController;

class EmbedController extends BaseController
{
    public function indexAction(Request $request)
    {
        $view = 'web-gallery/view.html.twig';
        return $this->render(sprintf('@%s/%s', $this->app['web_gallery.asset_namespace'], $view), [
        ]);
    }
}
