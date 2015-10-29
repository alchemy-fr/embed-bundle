<?php

namespace Alchemy\Embed\Embed;

use Alchemy\Embed\Controller\BaseController;
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

    public function __construct(Application $app, \appbox $appbox, ACLProvider $acl, Authenticator $authenticator)
    {
        parent::__construct($app);

        $this->appbox = $appbox;
        $this->acl = $acl;
        $this->authentication = $authenticator;
    }

    public function testIframeAction(Request $request, $sbas_id, $record_id, $subdefName)
    {
        $baseUrl = $this->app['request']->getSchemeAndHttpHost() . $this->app['request']->getBaseUrl();
        $embedUrl = $baseUrl . '/embed/' . $sbas_id . '/' . $record_id . '/' . $subdefName . '?token=' . $request->query->get('token');
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
        $record = $this->retrieveRecord($databox, $request->query->get('token'), $record_id, $subdefName);

        $template = 'image.html.twig';
        $subdef = $record->get_subdef($subdefName);
        $thumbnail = $record->get_thumbnail();
        $preview = $record->get_preview();
        $baseUrl = $this->app['request']->getSchemeAndHttpHost() ;
        $baseUrlPath = $baseUrl . $this->app['request']->getBaseUrl();
        $oembedUrl = $baseUrl . '/oembed/';
        $embedMedia = [];


        // @TODO - switch mode between iframe and raw embedding:
        // $request->query->get('displayMode')
        $displayModeViewPath = 'iframe';


        $substitutionPath = sprintf('/skins/icons/substitution/%s.png',
          str_replace('/', '_', $record->getMimeType())
        );

        // app.getAuthenticator().isAuthenticated() ? thumbnail.get_url() : thumbnail.get_permalink().get_url()

        switch($record->getType() ) {
            case 'video':
                $template = 'video.html.twig';
                $ogMetaDatas['og:type'] = 'video.other';
                $ogMetaDatas['og:image'] = $baseUrl.$thumbnail->get_url();
                $ogMetaDatas['og:image:width'] = $thumbnail->get_width();
                $ogMetaDatas['og:image:height'] = $thumbnail->get_height();

                $embedMedia['title'] = $record->get_title();
                $embedMedia['coverUrl'] = $baseUrl.$thumbnail->get_url();
                $embedMedia['source'] = [];
                $embedMedia['source'][] = [
                  'url' => $subdef->get_permalink()->get_url(),
                  'type' => $subdef->get_mime()
                ];
                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
            case 'flexpaper':
            case 'document':
                $template = 'document.html.twig';
                $ogMetaDatas['og:type'] = 'article';
                $ogMetaDatas['og:image'] = $baseUrl.$thumbnail->get_url();
                $ogMetaDatas['og:image:width'] = $thumbnail->get_width();
                $ogMetaDatas['og:image:height'] = $thumbnail->get_height();

                $embedMedia['title'] = $record->get_title();
                $embedMedia['url'] = $subdef->get_permalink()->get_url();
                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
            case 'audio':
                $template = 'audio.html.twig';
                $ogMetaDatas['og:type'] = 'music.song';
                $ogMetaDatas['og:image'] = $baseUrl.$substitutionPath; //$thumbnail->get_url();
                $ogMetaDatas['og:image:width'] = $thumbnail->get_width();
                $ogMetaDatas['og:image:height'] = $thumbnail->get_height();

                $embedMedia['title'] = $record->get_title();
                $embedMedia['source'] = [];
                $embedMedia['source'][] = [
                  'url' => $subdef->get_permalink()->get_url(),
                  'type' => $subdef->get_mime()
                ];
                $embedMedia['coverUrl'] = $baseUrl.$substitutionPath; //$thumbnail->get_url();
                // set default dimension for player
                $embedMedia['dimensions'] = [
                  'width' => 320,
                  'height' => 320,
                  'top' => 0
                ];
                break;
            default:
                $template = 'image.html.twig';
                $ogMetaDatas['og:type'] = 'image';
                $ogMetaDatas['og:image'] = $preview->get_permalink()->get_url();
                $ogMetaDatas['og:image:width'] = $subdef->get_width();
                $ogMetaDatas['og:image:height'] = $subdef->get_height();

                $embedMedia['title'] = $record->get_title();
                $embedMedia['url'] = $subdef->get_permalink()->get_url();
                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
        }

        return $this->app['twig']->render('@alchemy_embed/'.$displayModeViewPath.'/'.$template, [
          'ogMetaDatas' => $ogMetaDatas,
          'oembedUrl' => $oembedUrl,
          'embedMedia' => $embedMedia
        ]);
    }

    /**
     * Php raw implementation of thumbnails.html.twig macro
     * @param $subdef
     * @return array
     */
    private function getDimensions($subdef) {
        $outWidth = $subdef->get_width();
        $outHeight = $subdef->get_height()|$outWidth;

        $b_ratio = $outWidth / $outHeight;

        $thumbnail_height = $subdef->get_height() > 0 ? $subdef->get_height() : 120;
        $thumbnail_width = $subdef->get_width() > 0 ? $subdef->get_width() : 120;

        $i_ratio = $thumbnail_width / $thumbnail_height;

        if ($i_ratio > $b_ratio) {

            if ($outWidth > $thumbnail_width) {
                $outWidth = $thumbnail_width;
            }
            $outHeight = $outWidth / $thumbnail_width * $thumbnail_height;
            $top = ($outHeight - $outHeight) / 2;
        } else {
            if ($outHeight > $thumbnail_height) {
                $outHeight = $thumbnail_height;
            }
            $outWidth = $outHeight * $thumbnail_width / $thumbnail_height;
            $top = (($outHeight - $outHeight) / 2);
        }

        return [
            'width' => round($outWidth),
            'height' => round($outHeight),
            'top' => $top
        ];
    }

    /**
     * @param \databox $databox
     * @param string   $token
     * @param int      $record_id
     * @param string   $subdef
     * @return \record_adapter
     */
    private function retrieveRecord(\databox $databox, $token, $record_id, $subdef)
    {
        try {
            $record = new \record_adapter($this->app, $databox->get_sbas_id(), $record_id);
            $subDefinition = new \media_subdef($this->app, $record, $subdef);
            $permalink = new \media_Permalink_Adapter($this->app, $databox, $subDefinition);
        } catch (\Exception $exception) {
            throw new NotFoundHttpException('Wrong token.', $exception);
        }

        if (! $permalink->get_is_activated()) {
            throw new NotFoundHttpException('This token has been disabled.');
        }

        /** @var FeedItemRepository $feedItemsRepository */
        $feedItemsRepository = $this->app['repo.feed-items'];
        if (in_array($subdef, [\databox_subdef::CLASS_PREVIEW, \databox_subdef::CLASS_THUMBNAIL])
          && $feedItemsRepository->isRecordInPublicFeed($databox->get_sbas_id(), $record_id)
        ) {
            return $record;
        } elseif ($permalink->get_token() == (string) $token) {
            return $record;
        }

        throw new NotFoundHttpException('Wrong token.');
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
