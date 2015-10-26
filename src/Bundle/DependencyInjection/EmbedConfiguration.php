<?php

namespace Alchemy\EmbedBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class EmbedConfiguration implements ConfigurationInterface
{

    /**
     * Generates the configuration tree builder.
     *
     * @return \Symfony\Component\Config\Definition\Builder\TreeBuilder The tree builder
     */
    public function getConfigTreeBuilder()
    {
        $builder = new TreeBuilder();

        $builder
            ->root('alchemy_embed')
                ->children()
                    ->arrayNode('exceptions')
                        ->addDefaultsIfNotSet()
                        ->children()
                            ->arrayNode('content_types')
                                ->fixXmlConfig('content_type')
                                ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar')
                                    ->defaultValue('application/json')
                                ->end()
                            ->end()
                            ->scalarNode('enabled')->defaultTrue()->end()
                            ->scalarNode('transformer')->defaultNull()->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $builder;
    }
}
