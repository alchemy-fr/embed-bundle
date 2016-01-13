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

use Symfony\Component\HttpFoundation\Request;

final class MediaInformation
{
    /** @var \media_subdef */
    private $resource;
    /** @var Request */
    private $resourceRequest;
    /** @var string */
    private $route;
    /** @var array */
    private $routeParameters;

    public function __construct(\media_subdef $resource, Request $resourceRequest, $route, array $routeParameters)
    {
        $this->resource = $resource;
        $this->resourceRequest = $resourceRequest;
        $this->route = $route;
        $this->routeParameters = $routeParameters;
    }

    /**
     * @return \media_subdef
     */
    public function getResource()
    {
        return $this->resource;
    }

    /**
     * @return Request
     */
    public function getResourceRequest()
    {
        return $this->resourceRequest;
    }

    /**
     * @return string
     */
    public function getRoute()
    {
        return $this->route;
    }

    /**
     * @return array
     */
    public function getRouteParameters()
    {
        return $this->routeParameters;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->resourceRequest->getUri();
    }
}
