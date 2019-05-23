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
use Alchemy\Embed\Media\MediaInformation;
use Alchemy\Phrasea\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmbedController
{
    /** @var Application */
    private $app;
    /** @var Media */
    private $mediaService;
    /** @var Embed */
    private $embedService;

    public function __construct(Application $app, Media $mediaService, Embed $embedService)
    {
        $this->app = $app;
        $this->mediaService = $mediaService;
        $this->embedService = $embedService;
    }

    public function viewAction(Request $request)
    {
        $url = $request->query->get('url');

        $resourceRequest = $this->createResourceRequest($request, $url);
        $media = $this->matchResourceRequest($resourceRequest);
        $metaData = $this->mediaService->getMetaData($media);

        // is autoplay active?
        $metaData['options']['autoplay'] = $request->get('autoplay') == '1' ? true : false;

        // get the url t parameter if it exist
        $metaData['options']['t'] = ($request->get('t') == '') ? null : intval($request->get('t'));

        return $this->renderEmbed($media, $metaData);
    }

    public function viewVttAction(Request $request)
    {
        $url = $request->query->get('url');
        $choice = $request->query->get('choice');

        $resourceRequest = $this->createResourceRequest($request, $url);
        $media = $this->matchResourceRequest($resourceRequest);
        $videoTextTrack = $this->mediaService->getVideoTextTrackContent($media, $choice);

        if ($videoTextTrack !== false) {
            return new Response($videoTextTrack, 200, [
              'mime-type' => 'text/vtt'
            ]);
        }

        throw new NotFoundHttpException();
    }

    /**
     * Render Embed Twig view
     * @param MediaInformation $mediaInformation
     * @param array            $metaData
     * @return string
     */
    public function renderEmbed(MediaInformation $mediaInformation, array $metaData)
    {
        $record = $mediaInformation->getResource()->get_record();
        $embedConfig = $this->embedService->getConfiguration();


        switch ($record->getType()) {
            case 'video':
                if ($metaData['options']['autoplay'] === true) {
                    $embedConfig['video']['autoplay'] = true;
                }

                // if the url t parameter is set,
                // use it and override the currentTime
                if (isset($metaData['options']['t']) && $metaData['options']['t'] !== null) {
                    $metaData['embedMedia']['currentTime'] = $metaData['options']['t'];
                }

                $template = 'video.html.twig';
                break;
            case 'flexpaper':
            case 'document':
                $template = 'document.html.twig';

                // if document type is pdf and player is active, let's use original documents:

                $ie8OrLess = preg_match('/(?i)msie [6-8]/', $_SERVER['HTTP_USER_AGENT']);

                if ($mediaInformation->getResource()->get_name() == 'preview' &&
                    $mediaInformation->getResource()->get_mime() == 'application/pdf' &&
                    !$ie8OrLess) {
                    if ($embedConfig['document']['enable_pdfjs'] === true) {
                        if ($record->has_subdef('preview')) {
                            $subdef = $record->get_subdef('preview');
                            $embedConfig['document']['player'] = 'pdfjs';
                            $metaData['embedMedia']['url'] = (string)$subdef->get_permalink()->get_url();
                        }
                    }
                } elseif ($record->getMimeType() == 'application/pdf' && !$ie8OrLess) {
                    if ($embedConfig['document']['enable_pdfjs'] === true) {
                        if ($record->has_subdef('document')) {
                            $subdef = $record->get_subdef('document');
                            $embedConfig['document']['player'] = 'pdfjs';
                            $metaData['embedMedia']['url'] = (string)$subdef->get_permalink()->get_url();
                        }
                    }
                }

                break;
            case 'audio':
                if ($metaData['options']['autoplay'] === true) {
                    $embedConfig['audio']['autoplay'] = true;
                }
                $template = 'audio.html.twig';
                break;
            case 'image':
                $ie8OrLess = preg_match('/(?i)msie [6-8]/', $_SERVER['HTTP_USER_AGENT']);

                if ($mediaInformation->getResource()->get_name() == 'preview' &&
                    $mediaInformation->getResource()->get_mime() == 'application/pdf' &&
                    !$ie8OrLess) {
                    if ($embedConfig['document']['enable_pdfjs'] === true) {
                        if ($record->has_subdef('preview')) {
                            $subdef = $record->get_subdef('preview');
                            $embedConfig['document']['player'] = 'pdfjs';
                            $metaData['embedMedia']['url'] = (string)$subdef->get_permalink()->get_url();
                        }
                    }

                    $template = 'document.html.twig';
                } else {
                    $template = 'image.html.twig';
                }

                break;
            default:
                $template = 'image.html.twig';
                break;
        }

        $twigOptions = array_merge($embedConfig, $metaData);

        return $this->app['twig']->render('@alchemy_embed/iframe/'.$template, $twigOptions);
    }

    public function oembedAction(Request $request)
    {
        $url = $request->query->get('url');

        $resourceRequest = $this->createResourceRequest($request, $url);

        $media = $this->matchResourceRequest($resourceRequest);
        $metaData = $this->mediaService->getMetaData($media);

        $exportedMeta = [
            'version'      => '1.0',
            'type'         => $metaData['oembedMetaData']['type'],
            'width'        => $metaData['embedMedia']['dimensions']['width'],
            'height'       => $metaData['embedMedia']['dimensions']['height'],
            'title'        => $metaData['embedMedia']['title'],
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
    public function createResourceRequest(Request $request, $url)
    {
        $baseUri = $request->getUriForPath('');

        if ($url{0} === '/') {
            $url = $request->getSchemeAndHttpHost() . $url;
        }
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
    public function matchResourceRequest(Request $resourceRequest)
    {
        $urlParams = $this->app['url_matcher']->matchRequest($resourceRequest);

        return $this->app['alchemy_embed.resource_resolver']->resolve(
            $resourceRequest,
            $urlParams['_route'],
            $urlParams
        );
    }
}
