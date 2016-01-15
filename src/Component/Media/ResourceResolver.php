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

interface ResourceResolver
{
    /**
     * Given a resource route parameters, return \media_subdef instance
     * @param Request $request
     * @param string  $routeName
     * @param array   $routeParameters
     * @return MediaInformation
     */
    public function resolve(Request $request, $routeName, array $routeParameters);
}
