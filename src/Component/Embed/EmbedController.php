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
    /** @var Authenticator */
    private $authentication;
    /** @var Media */
    private $mediaService;

    public function __construct(Application $app, ACLProvider $acl, Authenticator $authenticator, Media $mediaService)
    {
        parent::__construct($app);

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

        // is autoplay active?
        $metaDatas['options']['autoplay'] = $request->get('autoplay') == '1' ? true: false;

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

        $baseUrl = $request->getBaseUrl();
        $matchingUrl = $urlRequest->getPathInfo();

        if (!empty($baseUrl)) {
            if (0 === strpos($matchingUrl, $baseUrl)) {
                $matchingUrl = substr($matchingUrl, strlen($baseUrl));
            }
        }

        $resourceParams = $this->app['url_matcher']->match($matchingUrl);

        $subdefId = $resourceParams['sbas_id'];
        $subdefName = $resourceParams['subdef'];
        $recordId = $resourceParams['record_id'];

        $record = new record_adapter($this->app, $subdefId, $recordId);
        $metaDatas = $this->mediaService->getMetaDatas($record, $subdefName);

        // is autoplay active?
        $metaDatas['options']['autoplay'] = $request->get('autoplay') == '1' ? true: false;

        return $this->renderEmbed($record, $metaDatas);
    }

    /**
     * Render Embed Twig view
     * @param $record record_adapter
     * @param $metaDatas
     * @return mixed
     */
    public function renderEmbed(record_adapter $record, $metaDatas)
    {
        // load predefined opts:
        $config = [
            'video_autoplay' => false,
            'video_options' => [],
            'video_available_speeds' => [],
            'video_player' => 'videojs',
            'audio_player' => 'videojs',
            'document_player' => 'flexpaper',
            'document' => [
                'enable_pdfjs' => true
            ]
        ];

        if (isset($this->app['phraseanet.configuration']['embed_bundle'])) {
            // override default option with phraseanet defined:
            $config = array_merge($config, $this->app['phraseanet.configuration']['embed_bundle']);
        }

        switch ($record->getType()) {
            case 'video':
                if( $metaDatas['options']['autoplay'] === true ) {
                    $config['video_autoplay'] = true;
                }
                $template = 'video.html.twig';
                break;
            case 'flexpaper':
            case 'document':
                $template = 'document.html.twig';

                // if document type is pdf and player is active, let's use original documents:

                $ie8OrLess = preg_match('/(?i)msie [6-8]/',$_SERVER['HTTP_USER_AGENT']);

                if ($record->getMimeType() == 'application/pdf' && !$ie8OrLess) {
                    if ($config['document']['enable_pdfjs'] === true) {
                        if ($record->has_subdef('document')) {
                            $subdef = $record->get_subdef('document');

                            $config['document_player'] = 'pdfjs';
                            $metaDatas['embedMedia']['url'] = (string)$subdef->get_permalink()->get_url();
                        }
                    }
                }

                break;
            case 'audio':
                if( $metaDatas['options']['autoplay'] === true ) {
                    $config['audio_autoplay'] = true;
                }
                $template = 'audio.html.twig';
                break;
            default:
                $template = 'image.html.twig';
                break;
        }

        $twigOptions = array_merge($config, $metaDatas);

        return $this->app['twig']->render('@alchemy_embed/iframe/'.$template, $twigOptions);
    }

}
