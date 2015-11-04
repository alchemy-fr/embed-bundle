<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\Embed\Embed;

use Alchemy\Embed\Controller\BaseController;
use Alchemy\Embed\Media\Media;
use Alchemy\Phrasea\Application;
use Alchemy\Phrasea\Authentication\ACLProvider;
use Alchemy\Phrasea\Authentication\Authenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmbedController extends BaseController
{
    /** @var ACLProvider */
    private $acl;
    /** @var \appbox */
    private $appbox;
    /** @var Authenticator */
    private $authentication;
    /** @var Media */
    private $mediaService;

    public function __construct(Application $app, \appbox $appbox, ACLProvider $acl, Authenticator $authenticator)
    {
        parent::__construct($app);

        $this->appbox = $appbox;
        $this->acl = $acl;
        $this->authentication = $authenticator;
        $this->mediaService = new Media($this->app, $this->app->getApplicationBox(), $this->app['acl'], $this->app->getAuthenticator());
    }

    public function testIframeAction(Request $request, $sbas_id, $record_id, $subdefName)
    {
        $baseUrl = $this->app['request']->getSchemeAndHttpHost().$this->app['request']->getBaseUrl();
        $embedUrl = $baseUrl.'/embed/'.$sbas_id.'/'.$record_id.'/'.$subdefName.'?token='.$request->query->get('token');
        $view = '@alchemy_embed/test/iframe.html.twig';

        return $this->app['twig']->render($view, [
          'embedUrl' => $embedUrl
        ]);
    }

    public function optionsAction(Request $request, $sbas_id, $record_id)
    {
        $databox = $this->getDatabox($sbas_id);
        $token = $request->query->get('token');
        $record = $this->retrieveRecord($databox, $token, $record_id, $request->get('subdef', 'thumbnail'));

        if (null === $record) {
            throw new NotFoundHttpException("Record not found");
        }

        return new Response('', 200, ['Allow' => 'GET, HEAD, OPTIONS']);
    }


    /**
     * @param Request $request
     * @param $sbas_id
     * @param $record_id
     * @param $subdefName
     * @return mixed
     */
    public function viewAction(Request $request, $sbas_id, $record_id, $subdefName)
    {
        $databox = $this->getDatabox($sbas_id);
        $token = $request->query->get('token');
        // @TODO - switch mode between iframe and raw embedding:
        // $request->query->get('displayMode')
        $displayModeViewPath = 'iframe';

        $record = $this->mediaService->retrieveRecord($databox, $token, $record_id, $subdefName);
        $metaDatas = $this->mediaService->getMetaDatas($record, $subdefName);

        switch ($record->getType()) {
            case 'video':
                $template = 'video.html.twig';
                break;
            case 'flexpaper':
            case 'document':
                $template = 'document.html.twig';
                break;
            case 'audio':
                $template = 'audio.html.twig';
                break;
            default:
                $template = 'image.html.twig';
                break;
        }

        return $this->app['twig']->render('@alchemy_embed/'.$displayModeViewPath.'/'.$template, $metaDatas);

    }

    /**
     * @param int $databoxId
     * @return \databox
     */
    private function getDatabox($databoxId)
    {
        return $this->appbox->get_databox((int)$databoxId);
    }
}
