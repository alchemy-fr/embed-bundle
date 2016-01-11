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

use Alchemy\Embed\Controller\BaseController;
use Alchemy\Embed\Media\Media;
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
    /** @var Media */
    private $mediaService;

    /**
     * OembedController constructor.
     * @param Application $app
     * @param \appbox $appbox
     * @param ACLProvider $acl
     * @param Authenticator $authenticator
     */
    public function __construct(Application $app, \appbox $appbox, ACLProvider $acl, Authenticator $authenticator)
    {
        parent::__construct($app);

        $this->appbox = $appbox;
        $this->acl = $acl;
        $this->authentication = $authenticator;
        $this->mediaService = new Media($this->app, $this->app->getApplicationBox(), $this->app['acl'], $this->app->getAuthenticator());
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
        $databox = $this->getDatabox($resourceParams['sbas_id']);
        $token = $urlRequest->get('token');

        $record = $this->mediaService->retrieveRecord($databox, $token, $resourceParams['record_id'], $resourceParams['subdefName']);
        $metaDatas = $this->mediaService->getMetaData($record, $resourceParams['subdefName']);


        $exportMetas = [
          'version' => '1.0',
          'type' => $metaDatas['oembedMetaDatas']['type'],
          'width' => $metaDatas['ogMetaDatas']['og:image:width'],
          'height' => $metaDatas['ogMetaDatas']['og:image:height'],
          'title' => $record->get_title(),
          'url' => $metaDatas['embedMedia']['url'],
            // 'provider_name'=>'$this->app['request']->',
          'provider_url' => $request->getSchemeAndHttpHost()
        ];

        if (array_key_exists('html', $metaDatas['oembedMetaDatas'])) {
            $exportMetas['html'] = $metaDatas['oembedMetaDatas']['html'];
        }

        return $this->app->json($exportMetas);
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
