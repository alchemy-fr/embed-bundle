<?php

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
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function indexAction(Request $request)
    {
        $urlRequest = Request::create($request->get('url'));

        $matchingUrl = $urlRequest->getPathInfo();
        if (0 === strpos($matchingUrl, $request->getBaseUrl())) {
            $matchingUrl = substr($matchingUrl, strlen($request->getBaseUrl()));
        }

        $resourceParams = $this->app['url_matcher']->match($matchingUrl);
        $databox = $this->getDatabox($resourceParams['sbas_id']);
        $token = $urlRequest->get('token');

        $media = new Media($this->app);
        $record = $media->retrieveRecord($databox, $token, $resourceParams['record_id'], $resourceParams['subdefName']);
        $metaDatas = $media->getMetaDatas($record, $resourceParams['subdefName']);


        $exportMetas = [
          'version' => '1.0',
          'type' => $metaDatas['oembedMetaDatas']['type'],
          'width' => $metaDatas['ogMetaDatas']['og:image:width'],
          'height' => $metaDatas['ogMetaDatas']['og:image:height'],
          'title' => $record->get_title(),
          'url' => $metaDatas['embedMedia']['url'],
            // 'provider_name'=>'$this->app['request']->',
          'provider_url' => $this->app['request']->getSchemeAndHttpHost()
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
