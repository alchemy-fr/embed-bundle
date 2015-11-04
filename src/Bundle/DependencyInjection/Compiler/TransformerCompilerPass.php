<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\EmbedBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class TransformerCompilerPass implements CompilerPassInterface
{
    /**
     * You can modify the container here before it is dumped to PHP code.
     *
     * @param ContainerBuilder $container
     *
     * @api
     */
    public function process(ContainerBuilder $container)
    {
        if (! $container->hasDefinition('alchemy_embed.transformer_registry')) {
            return;
        }

        $transformerRegistry = $container->findDefinition('alchemy_embed.transformer_registry');
        $transformerTags = $container->findTaggedServiceIds('alchemy_embed.transformer');

        foreach ($transformerTags as $id => $tags) {
            foreach ($tags as $tag) {
                $transformerRegistry->addMethodCall('setTransformer', array($tag['alias'], new Reference($id)));
            }
        }
    }
}
