<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\Embed\Media;

use Alchemy\Phrasea\Application;
use Alchemy\Phrasea\Authentication\ACLProvider;
use Alchemy\Phrasea\Authentication\Authenticator;
use Alchemy\Phrasea\Controller\AbstractDelivery;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Media extends AbstractDelivery
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

    /**
     * @param $sbasId
     * @param $recordId
     * @return \record_adapter
     */
    public function getRecord($sbasId, $recordId)
    {
        try {
            $record = new \record_adapter($this->app, $sbasId, $recordId);
        } catch (\Exception $exception) {
            throw new NotFoundHttpException('Record Not Found.', $exception);
        }

        return $record;
    }

    /**
     * Return embed Url
     * @param $record
     * @param $subdefName
     * @return string
     */
    public function getEmbedUrl($record, $subdefName)
    {
        $sbas_id = $record->getDataboxId();
        $baseUrl = $this->app['request']->getSchemeAndHttpHost().$this->app['request']->getBaseUrl();

        $subdef = $record->get_subdef($subdefName);
        $token = $subdef->get_permalink()->get_token();

        return $baseUrl.'/embed/'.$sbas_id.'/'.$record->getRecordId().'/'.$subdefName.'/?token='.$token;
    }

    /**
     * Return all available metaDatas
     * @param $record
     * @param $subdefName
     * @return array
     */
    public function getMetaDatas($record, $subdefName)
    {
        $subdef = $record->get_subdef($subdefName);
        $thumbnail = $record->get_thumbnail();
        $preview = $record->get_preview();
        $baseUrl = $this->app['request']->getSchemeAndHttpHost();
        $baseUrlPath = $baseUrl.$this->app['request']->getBaseUrl();
        $oembedUrl = $baseUrlPath.'/oembed/';


        $ogMetaDatas = [];
        $embedMedia = [];
        $oembedMetaDatas = [];

        $substitutionPath = sprintf('/assets/common/images/icons/substitution/%s.png',
          str_replace('/', '_', $record->getMimeType())
        );

        // app.getAuthenticator().isAuthenticated() ? thumbnail.get_url() : thumbnail.get_permalink().get_url()

        $embedMedia['title'] = $record->get_title();
        $embedMedia['url'] = (string)$subdef->get_permalink()->get_url();
        switch ($record->getType()) {
            case 'video':
                $template = 'video.html.twig';
                $ogMetaDatas['og:type'] = 'video.other';
                $ogMetaDatas['og:image'] = $baseUrl.$thumbnail->get_url();
                $ogMetaDatas['og:image:width'] = $thumbnail->get_width();
                $ogMetaDatas['og:image:height'] = $thumbnail->get_height();

                $embedMedia['coverUrl'] = $baseUrl.$thumbnail->get_url();
                $embedMedia['source'] = [];
                $embedMedia['source'][] = [
                  'url' => $subdef->get_permalink()->get_url(),
                  'type' => $subdef->get_mime()
                ];
                $embedMedia['dimensions'] = $this->getDimensions($subdef);

                $oembedMetaDatas['type'] = 'video';
                $oembedMetaDatas['html'] = '<iframe width="'.$embedMedia['dimensions']['width'].'" height="'.$embedMedia['dimensions']['height'].'" src="'.$this->getEmbedUrl($record,
                    $subdefName).'" frameborder="0" allowfullscreen></iframe>';
                break;
            case 'flexpaper':
            case 'document':
                $ogMetaDatas['og:type'] = 'article';
                $ogMetaDatas['og:image'] = $baseUrl.$thumbnail->get_url();
                $ogMetaDatas['og:image:width'] = $thumbnail->get_width();
                $ogMetaDatas['og:image:height'] = $thumbnail->get_height();

                $oembedMetaDatas['type'] = 'link';
                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
            case 'audio':
                $ogMetaDatas['og:type'] = 'music.song';
                $ogMetaDatas['og:image'] = $baseUrl.$substitutionPath;
                $ogMetaDatas['og:image:width'] = $thumbnail->get_width();
                $ogMetaDatas['og:image:height'] = $thumbnail->get_height();


                $oembedMetaDatas['type'] = 'link';
                $embedMedia['source'] = [];
                $embedMedia['source'][] = [
                  'url' => (string)$subdef->get_permalink()->get_url(),
                  'type' => $subdef->get_mime()
                ];
                $embedMedia['coverUrl'] = $baseUrl.$substitutionPath;
                // set default dimension for player
                $embedMedia['dimensions'] = [
                  'width' => 320,
                  'height' => 320,
                  'top' => 0
                ];
                break;
            default:
                $oembedMetaDatas['type'] = 'photo';
                $ogMetaDatas['og:type'] = 'image';
                $ogMetaDatas['og:image'] = (string)$preview->get_permalink()->get_url();
                $ogMetaDatas['og:image:width'] = $subdef->get_width();
                $ogMetaDatas['og:image:height'] = $subdef->get_height();

                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
        }

        return [
          'oembedMetaDatas' => $oembedMetaDatas,
          'ogMetaDatas' => $ogMetaDatas,
          'oembedUrl' => $oembedUrl,
          'embedMedia' => $embedMedia
        ];
    }


    /**
     * Php raw implementation of thumbnails.html.twig macro
     * @param $subdef
     * @return array
     */
    private function getDimensions($subdef)
    {

        $outWidth = $subdef->get_width();
        $outHeight = $subdef->get_height();
        if( $outWidth > 0 && $outHeight > 0) {


        } else {
            if( $outWidth > $outHeight) {

            }
        }


        $outWidth = $subdef->get_width();
        $outHeight = $subdef->get_height() | $outWidth;

        $thumbnail_height = $subdef->get_height() > 0 ? $subdef->get_height() : 120;
        $thumbnail_width = $subdef->get_width() > 0 ? $subdef->get_width() : 120;

        $subdefRatio = 0;
        $thumbnailRatio = $thumbnail_width / $thumbnail_height;
        if( $outWidth > 0 && $outHeight > 0) {
            $subdefRatio = $outWidth / $outHeight;
        }

        if ($thumbnailRatio > $subdefRatio) {

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
        /*if( $outWidth === 0 || $outHeight === 0) {
            $outWidth = 640;//$thumbnail_height;
              $outHeight = 480;//$thumbnail_width;
        }*/


        return [
          'width' => round($outWidth),
          'height' => round($outHeight),
          'top' => $top
        ];
    }

    /**
     * @param \databox $databox
     * @param string $token
     * @param int $record_id
     * @param string $subdef
     * @return \record_adapter
     */
    public function retrieveRecord(\databox $databox, $token, $record_id, $subdef)
    {
        try {
            $record = new \record_adapter($this->app, $databox->get_sbas_id(), $record_id);

            $subDefinition = new \media_subdef($this->app, $record, $subdef);
            $permalink = new \media_Permalink_Adapter($this->app, $databox, $subDefinition);
        } catch (\Exception $exception) {
            throw new NotFoundHttpException('Wrong token.', $exception);
        }

        if (!$permalink->get_is_activated()) {
            throw new NotFoundHttpException('This token has been disabled.');
        }

        /** @var FeedItemRepository $feedItemsRepository */
        $feedItemsRepository = $this->app['repo.feed-items'];
        if (in_array($subdef, [\databox_subdef::CLASS_PREVIEW, \databox_subdef::CLASS_THUMBNAIL])
          && $feedItemsRepository->isRecordInPublicFeed($databox->get_sbas_id(), $record_id)
        ) {
            return $record;
        } elseif ($permalink->get_token() == (string)$token) {
            return $record;
        }

        throw new NotFoundHttpException('Wrong token.');
    }

    /**
     * @param int $databoxId
     * @return \databox
     */
    public function getDatabox($databoxId)
    {
        return $this->appbox->get_databox((int)$databoxId);
    }
}
