<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2016 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Alchemy\Embed\Media;

final class MediaInformation
{
    /** @var \media_subdef */
    private $resource;
    private $url;
    private $embedUrl;

    public function __construct(\media_subdef $resource, $url, $embedUrl)
    {
        $this->resource = $resource;
        $this->url = $url;
        $this->embedUrl = $embedUrl;
    }

    /**
     * @return \media_subdef
     */
    public function getResource()
    {
        return $this->resource;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @return string
     */
    public function getEmbedUrl()
    {
        return $this->embedUrl;
    }
}
