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

class ChainedResourceResolver implements ResourceResolver
{
    /** @var ResourceResolver[]|array */
    private $resolvers;

    /**
     * @param array|ResourceResolver[] $resolvers
     */
    public function __construct($resolvers = [])
    {
        $this->resolvers = $resolvers;
    }

    public function resolve(Request $request, $routeName, array $routeParameters)
    {
        if (!isset($this->resolvers[$routeName])) {
            throw new \RuntimeException('No resources found for given parameters');
        }

        $resolver = $this->resolvers[$routeName];

        if (!$resolver instanceof ResourceResolver) {
            throw new \InvalidArgumentException(sprintf(
                'Expects resolver to be an instance of "%s", got "%s".',
                ResourceResolver::class,
                is_object($resolver) ? get_class($resolver) : gettype($resolver)
            ));
        }

        return $resolver->resolve($request, $routeName, $routeParameters);
    }
}
