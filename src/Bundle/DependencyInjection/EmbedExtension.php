<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\EmbedBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\HttpKernel\DependencyInjection\ConfigurableExtension;

class EmbedExtension extends ConfigurableExtension
{
    /**
     * @param array $config
     * @param ContainerBuilder $container
     * @return EmbedConfiguration
     */
    public function getConfiguration(array $config, ContainerBuilder $container)
    {
        return new EmbedConfiguration();
    }

    /**
     * @param array $config
     * @param ContainerBuilder $container
     */
    protected function loadInternal(array $config, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(
            __DIR__ . '/../Resources/config'
        ));

        $loader->load('services.yml');
        $loader->load('listeners.yml');

        $this->configureExceptionListener($config['exceptions'], $container);
    }

    /**
     * @param array $config
     * @param ContainerBuilder $container
     */
    protected function configureExceptionListener(array $config, ContainerBuilder $container)
    {
        if (! $config['enabled']) {
            $container->removeDefinition('alchemy_embed.exception_listener');

            return;
        }

        $listenerDefinition = $container->getDefinition('alchemy_embed.exception_listener');

        if ($config['transformer'] !== null) {
            $listenerDefinition->replaceArgument(0, new Reference($config['transformer']));
        }

        $listenerDefinition->replaceArgument(1, $config['content_types']);
    }
}
