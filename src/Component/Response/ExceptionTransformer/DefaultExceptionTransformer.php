<?php
/*
 * This file is part of Phraseanet
 *
 * (c) 2005-2015 Alchemy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Alchemy\Embed\Response\ExceptionTransformer;

use Alchemy\Embed\Response\ExceptionTransformer;

class DefaultExceptionTransformer implements ExceptionTransformer
{
    /**
     * @var bool
     */
    private $debug;

    /**
     * @param bool $debug
     */
    public function __construct($debug = false)
    {
        $this->debug = (bool) $debug;
    }

    /**
     * @param \Exception $exception
     * @return array
     */
    public function transformException(\Exception $exception)
    {
        $data = array(
            'code' => $exception->getCode(),
            'message' => $exception->getMessage()
        );

        if ($this->debug === true) {
            $data['exception'] = get_class($exception);
            $data['trace'] = $exception->getTraceAsString();
        }

        return array('error' => $data);
    }
}
