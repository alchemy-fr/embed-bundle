<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
