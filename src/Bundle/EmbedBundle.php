<?php

namespace Alchemy\EmbedBundle;

use Alchemy\EmbedBundle\DependencyInjection\Compiler\TransformerCompilerPass;
use Alchemy\EmbedBundle\DependencyInjection\EmbedExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class EmbedBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new TransformerCompilerPass());
    }

    public function getContainerExtension()
    {
        return new EmbedExtension();
    }
}
