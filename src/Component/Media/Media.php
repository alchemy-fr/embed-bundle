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
use Alchemy\Phrasea\Controller\AbstractDelivery;
use Symfony\Component\HttpFoundation\Request;

class Media extends AbstractDelivery
{
    public function createMediaInformationFromResourceAndRoute(\media_subdef $subdef, $route, array $parameters = [])
    {
        $urlGenerator = $this->app['url_generator'];

        $url = $urlGenerator->generate($route, $parameters, $urlGenerator::ABSOLUTE_URL);

        return new MediaInformation($subdef, Request::create($url), $route, $parameters);
    }

    /**
     * Return all available metaData
     * @param MediaInformation $information
     * @return array
     */
    public function getMetaData(MediaInformation $information)
    {
        $subdef = $information->getResource();
        $record = $subdef->get_record();
        $thumbnail = $record->get_thumbnail();
        $request = $information->getResourceRequest();
        $baseUrl = $request->getSchemeAndHttpHost() . $request->getBasePath();


        $ogMetaData = [];
        $embedMedia = [];
        $oembedMetaData = [];

        $substitutionPath = sprintf(
            '/assets/common/images/icons/substitution/%s.png',
            str_replace('/', '_', $record->getMimeType())
        );

        $resourceUrl = $information->getUrl();

        $embedMedia['title'] = $record->get_title();
        $embedMedia['url'] = $resourceUrl;

        switch ($record->getType()) {
            case 'video':
                $ogMetaData['og:type'] = 'video.other';
                $ogMetaData['og:image'] = $baseUrl . $thumbnail->get_url();
                $ogMetaData['og:image:width'] = $thumbnail->get_width();
                $ogMetaData['og:image:height'] = $thumbnail->get_height();

                $coverUrl = $baseUrl . $thumbnail->get_url();

                $embedConfig = $this->getEmbedConfiguration();

                // if user config has custom subdef specified:
                if (array_key_exists('video', $embedConfig)) {
                    if (array_key_exists('coverSubdef', $embedConfig['video'])) {
                        $customCoverName = $embedConfig['video']['coverSubdef'];
                        try {
                            $customCover = $record->get_subdef($customCoverName);
                            $coverUrl = $baseUrl.$customCover->get_url();
                        } catch (\Exception $e) {
                            // no existing custom cover
                        }
                    }
                }

                $embedMedia['coverUrl'] = $coverUrl;
                $embedMedia['source'] = [];
                $embedMedia['source'][] = [
                    'url'  => $resourceUrl,
                    'type' => $subdef->get_mime(),
                ];

                $embedMedia['track'] = $this->getAvailableVideoTextTracks($information);



                $embedMedia['dimensions'] = $this->getDimensions($subdef);

                $oembedMetaData['type'] = 'video';
                $oembedMetaData['html'] = sprintf(
                    '<iframe width="%d" height="%d" src="%s" frameborder="0" allowfullscreen></iframe>',
                    $embedMedia['dimensions']['width'],
                    $embedMedia['dimensions']['height'],
                    $this->getEmbedUrl($resourceUrl)
                );
                break;
            case 'flexpaper':
            case 'document':
                $ogMetaData['og:type'] = 'article';
                $ogMetaData['og:image'] = $baseUrl . $thumbnail->get_url();
                $ogMetaData['og:image:width'] = $thumbnail->get_width();
                $ogMetaData['og:image:height'] = $thumbnail->get_height();

                $oembedMetaData['type'] = 'link';
                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
            case 'audio':
                $ogMetaData['og:type'] = 'music.song';
                $ogMetaData['og:image'] = $baseUrl . $substitutionPath;
                $ogMetaData['og:image:width'] = $thumbnail->get_width();
                $ogMetaData['og:image:height'] = $thumbnail->get_height();

                $oembedMetaData['type'] = 'link';
                $embedMedia['source'] = [];
                $embedMedia['source'][] = [
                    'url'  => $resourceUrl,
                    'type' => $subdef->get_mime()
                ];
                $embedMedia['coverUrl'] = $baseUrl . $substitutionPath;
                // set default dimension for player
                $embedMedia['dimensions'] = [
                    'width'  => 320,
                    'height' => 320,
                    'top'    => 0,
                ];
                break;
            default:
                $oembedMetaData['type'] = 'photo';
                $ogMetaData['og:type'] = 'image';
                $ogMetaData['og:image'] = (string)$record->get_preview()->get_permalink()->get_url();
                $ogMetaData['og:image:width'] = $subdef->get_width();
                $ogMetaData['og:image:height'] = $subdef->get_height();

                $embedMedia['dimensions'] = $this->getDimensions($subdef);
                break;
        }

        return [
            'options'        => [
                'autoplay' => false,
            ],
            'oembedMetaData' => $oembedMetaData,
            'ogMetaData'     => $ogMetaData,
            'embedMedia'     => $embedMedia,
        ];
    }

    /**
     * Php raw implementation of thumbnails.html.twig macro
     * @param \media_subdef $subdef
     * @return array
     */
    private function getDimensions(\media_subdef $subdef)
    {
        $outWidth = $subdef->get_width();
        $outHeight = $subdef->get_height() | $outWidth;

        $thumbnail_height = $subdef->get_height() > 0 ? $subdef->get_height() : 120;
        $thumbnail_width = $subdef->get_width() > 0 ? $subdef->get_width() : 120;

        $subdefRatio = 0;
        $thumbnailRatio = $thumbnail_width / $thumbnail_height;
        if ($outWidth > 0 && $outHeight > 0) {
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

        return [
            'width'  => round($outWidth),
            'height' => round($outHeight),
            'top'    => $top
        ];
    }

    private function getEmbedUrl($url)
    {
        $urlGenerator = $this->app['url_generator'];

        return $urlGenerator->generate('alchemy_embed_view', ['url' => $url]);
    }

    /**
     * Fetch vtt files content if exists
     * @param MediaInformation $media
     * @return bool|string Video Text Track content
     */
    public function getVideoTextTrackContent(MediaInformation $media, $id)
    {
        $id = (int)$id;
        $record = $media->getResource()->get_record();
        $videoTextTrack = false;

        if ($record->getType() === 'video') {
            $databox = $record->getDatabox();
            $vttIds = [];

            // list available vtt ids
            foreach ($databox->get_meta_structure() as $meta) {
                if (preg_match('/^VideoTextTrack(.*)$/iu', $meta->get_name(), $foundParts)) {
                    $vttIds[] = $meta->get_id();
                }
            }

            // extract vtt content from ids
            foreach ($record->get_caption()->get_fields(null, true) as $field) {
                // if a category is matching, ensure it's vtt related
                if (!in_array($id, $vttIds) || $id !== $field->get_meta_struct_id()) {
                    continue;
                }

                foreach ($field->get_values() as $value) {
                    // get vtt raw content
                    $videoTextTrack = $value->getValue();
                }
            }
        }

        return $videoTextTrack;
    }

    /**
     * list available video text tracks (only metadatas)
     * @param MediaInformation $media
     * @return array
     */
    public function getAvailableVideoTextTracks(MediaInformation $media)
    {
        $record = $media->getResource()->get_record();
        $videoTextTrack = [];

        if ($record->getType() === 'video') {
            $databox = $record->getDatabox();
            $vttIds = [];
            $vttMetadata = [];

            // extract vtt ids and labels
            foreach ($databox->get_meta_structure() as $meta) {
                $foundParts = [];
                if (preg_match('/^VideoTextTrack(.*)$/iu', $meta->get_name(), $foundParts)) {
                    $vttIds[] = $meta->get_id();

                    /*
                    Available HTML5 track types:
                        - captions
                        - chapters
                        - descriptions
                        - metadata
                        - subtitles
                    */
                    $kind = '';
                    $setAsDefault = false;
                    $vttFoundKind = strtolower($foundParts[1]);
                    switch ($vttFoundKind) {
                        case 'chapters':
                            $setAsDefault = true;
                            $kind = 'chapters';
                            break;
                        default:
                            $kind = 'subtitles';
                    }

                    $vttMetadata[$meta->get_id()] = [
                      'label' => empty($foundParts[1]) ? 'default' : $foundParts[1], //@todo translate
                      'srclang' => '',
                      'default' => $setAsDefault,
                      'kind' => $kind,
                    ];
                }
            }

            // extract vtt metadatas from ids
            foreach ($record->get_caption()->get_fields(null, true) as $field) {
                $metaStructId = $field->get_meta_struct_id();

                if (!in_array($metaStructId, $vttIds)) {
                    continue;
                }

                foreach ($field->get_values() as $value) {
                    $videoTextTrack[] = array_merge([
                      'src' => $this->getEmbedVttUrl($media->getUrl(), ['choice' => $metaStructId]),
                      'id' => $metaStructId
                    ], $vttMetadata[$metaStructId]);
                }
            }
        }

        return $videoTextTrack;
    }

    private function getEmbedConfiguration()
    {

        $embedService = $this->app['alchemy_embed.service.embed'];

        return $embedService->getConfiguration();
    }

    private function getEmbedVttUrl($url, $options = [])
    {
        $urlGenerator = $this->app['url_generator'];

        $queryOptions = array_merge(['url' => $url], $options);

        return $urlGenerator->generate('alchemy_embed_view_vtt', $queryOptions);
    }
}
