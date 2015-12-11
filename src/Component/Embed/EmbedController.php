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
use record_adapter;
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

    public function __construct(Application $app, \appbox $appbox, ACLProvider $acl, Authenticator $authenticator, Media $mediaService)
    {
        parent::__construct($app);

        $this->appbox = $appbox;
        $this->acl = $acl;
        $this->authentication = $authenticator;
        $this->mediaService = $mediaService;
    }

    public function testIframeAction(Request $request, $sbas_id, $record_id, $subdefName)
    {
        $embedUrl = $this->app->url('alchemy_embed_view', [
            'sbas_id' => $sbas_id,
            'record_id' => $record_id,
            'subdefName' => $subdefName,
            'token' => $request->query->get('token'),
        ]);
        $view = '@alchemy_embed/test/iframe.html.twig';

        return $this->app['twig']->render($view, [
          'embedUrl' => $embedUrl
        ]);
    }

    public function optionsAction(Request $request, $sbas_id, $record_id)
    {
        $databox = $this->mediaService->getDatabox($sbas_id);
        $token = $request->query->get('token');
        $record = $this->mediaService->retrieveRecord($databox, $token, $record_id, $request->get('subdef', 'thumbnail'));

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
        $databox = $this->mediaService->getDatabox($sbas_id);
        $token = $request->query->get('token');


        $record = $this->mediaService->retrieveRecord($databox, $token, $record_id, $subdefName);
        $metaDatas = $this->mediaService->getMetaDatas($record, $subdefName);


        return $this->renderEmbed($record, $metaDatas);
    }

    /**
     * Get record by sbasId, recordId and subdefName
     * @param Request $request
     * @return mixed - rendered twig
     */
    public function viewDatafileAction(Request $request)
    {
        $urlRequest = Request::create($request->get('url'));

        $matchingUrl = $urlRequest->getPathInfo();
        if (0 === strpos($matchingUrl, $request->getBaseUrl())) {
            $matchingUrl = substr($matchingUrl, strlen($request->getBaseUrl()));
        }

        $resourceParams = $this->app['url_matcher']->match($matchingUrl);

        $subdefId = $resourceParams['sbas_id'];
        $subdefName = $resourceParams['subdef'];
        $recordId = $resourceParams['record_id'];

        $record = new record_adapter($this->app, $subdefId, $recordId);
        $metaDatas = $this->mediaService->getMetaDatas($record, $subdefName);

        return $this->renderEmbed($record, $metaDatas);
    }

    public function renderEmbed($record, $metaDatas)
    {
        // @TODO - switch mode between iframe and raw embedding:
        // $request->query->get('displayMode')
        $displayModeViewPath = 'iframe';
        // load predefined opts:
        $config = [
          'video_autoplay' => false,
          'video_options' => [

          ],
          'video_player' => 'videojs',
          'audio_player' => 'videojs',
          'document_player' => 'flexpaper'
        ];


        switch ($record->getType()) {
            case 'video':
                $template = 'video.html.twig';
                break;
            case 'flexpaper':
            case 'document':
                $template = 'document.html.twig';
                break;
            case 'pdf_document':
                $config['document_player'] = 'pdfjs';
                $template = 'document.html.twig'; // @TODO switch to mozilla pdf viewer?
                break;
            case 'audio':
                $template = 'audio.html.twig';
                break;
            default:
                $template = 'image.html.twig';
                break;
        }


        if (isset($this->app['phraseanet.configuration']['embed_bundle'])) {
            // override default option with phraseanet defined:
            $config = array_merge($config, $this->app['phraseanet.configuration']['embed_bundle']);
        }

        $twigOptions = array_merge($config, $metaDatas);

        return $this->app['twig']->render('@alchemy_embed/'.$displayModeViewPath.'/'.$template, $twigOptions);
    }

}
