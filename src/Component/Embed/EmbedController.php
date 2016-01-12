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

use Alchemy\Embed\Media\Media;
use Alchemy\Phrasea\Application;
use record_adapter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class EmbedController
{
    /** @var Application */
    private $app;
    /** @var Media */
    private $mediaService;

    public function __construct(Application $app, Media $mediaService)
    {
        $this->app = $app;
        $this->mediaService = $mediaService;
    }

    public function viewAction(Request $request)
    {
        $url = $request->query->get('url');

        $resourceRequest = $this->createResourceRequest($request, $url);

        $media = $this->matchResourceRequest($resourceRequest);

        $subdef = $media->getResource();

        $metaData = $this->mediaService->getMetaData($request, $subdef->get_record(), $subdef->get_name());

        // is autoplay active?
        $metaData['options']['autoplay'] = $request->get('autoplay') == '1' ? true : false;

        return $this->renderEmbed($subdef->get_record(), $metaData);
    }

    /**
     * Render Embed Twig view
     * @param record_adapter $record
     * @param array $metaData
     * @return mixed
     */
    public function renderEmbed(record_adapter $record, array $metaData)
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
                if ($metaData['options']['autoplay'] === true) {
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
                            $metaData['embedMedia']['url'] = (string)$subdef->get_permalink()->get_url();
                        }
                    }
                }

                break;
            case 'audio':
                if ($metaData['options']['autoplay'] === true) {
                    $config['audio_autoplay'] = true;
                }
                $template = 'audio.html.twig';
                break;
            default:
                $template = 'image.html.twig';
                break;
        }

        $twigOptions = array_merge($config, $metaData);

        return $this->app['twig']->render('@alchemy_embed/iframe/'.$template, $twigOptions);
    }

    public function oembedAction(Request $request)
    {
        $url = $request->query->get('url');

        $resourceRequest = $this->createResourceRequest($request, $url);

        $media = $this->matchResourceRequest($resourceRequest);

        $subdef = $media->getResource();

        $metaData = $this->mediaService->getMetaData($request, $subdef->get_record(), $subdef->get_name());

        $exportedMeta = [
            'version'      => '1.0',
            'type'         => $metaData['oembedMetaData']['type'],
            'width'        => $metaData['ogMetaData']['og:image:width'],
            'height'       => $metaData['ogMetaData']['og:image:height'],
            'title'        => $subdef->get_record()->get_title(),
            'url'          => $metaData['embedMedia']['url'],
            // 'provider_name'=>'$this->app['request']->',
            'provider_url' => $request->getSchemeAndHttpHost()
        ];

        if (array_key_exists('html', $metaData['oembedMetaData'])) {
            $exportedMeta['html'] = $metaData['oembedMetaData']['html'];
        }

        return $this->app->json($exportedMeta);
    }

    /**
     * @param Request $request
     * @param string  $url
     * @return Request
     */
    private function createResourceRequest(Request $request, $url)
    {
        $baseUri = $request->getUriForPath('');

        if (strncmp($url, $baseUri, strlen($baseUri)) !== 0) {
            throw new BadRequestHttpException('Given url does not apply to this server instance');
        }

        $resourceRequest = Request::create($url, 'GET', [], $request->cookies->all(), [], $request->server->all());
        if ($request->getSession()) {
            $resourceRequest->setSession($request->getSession());
        }

        return $resourceRequest;
    }

    /**
     * @param Request $resourceRequest
     * @return \Alchemy\Embed\Media\MediaInformation
     */
    private function matchResourceRequest(Request $resourceRequest)
    {
        $urlParams = $this->app['url_matcher']->matchRequest($resourceRequest);

        return $this->app['alchemy_embed.resource_resolver']->resolve(
            $resourceRequest,
            $urlParams['_route'],
            $urlParams
        );
    }
}
