<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\Embed\Response;

interface ExceptionTransformer
{
    /**
     * @param \Exception $exception
     * @return array
     */
    public function transformException(\Exception $exception);
}
