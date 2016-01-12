<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\Embed\Oembed;

use Alchemy\Embed\Media\Media;
use Alchemy\Phrasea\Application;
use Symfony\Component\HttpFoundation\Request;

class OembedController
{
    /** @var Application */
    private $app;
    /** @var Media */
    private $mediaService;

    /**
     * OembedController constructor.
     * @param Application $app
     * @param Media       $media
     */
    public function __construct(Application $app, Media $media)
    {
        $this->app = $app;
        $this->mediaService = $media;
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function indexAction(Request $request)
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

        $resource = $this->app['alchemy_embed.resolver.resource']->resolve($resourceParams);

        $databox = $this->getDatabox($resourceParams['sbas_id']);
        $token = $urlRequest->get('token');

        $record = $this->mediaService->retrieveRecord($databox, $token, $resourceParams['record_id'], $resourceParams['subdefName']);
        $metaData = $this->mediaService->getMetaData($request, $record, $resourceParams['subdefName']);


        $exportedMeta = [
            'version'      => '1.0',
            'type'         => $metaData['oembedMetaData']['type'],
            'width'        => $metaData['ogMetaData']['og:image:width'],
            'height'       => $metaData['ogMetaData']['og:image:height'],
            'title'        => $record->get_title(),
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
     * @param int $databoxId
     * @return \databox
     */
    private function getDatabox($databoxId)
    {
        return $this->appbox->get_databox((int)$databoxId);
    }
}
