<?php

namespace Alchemy\Embed\Response;

interface ExceptionTransformer
{
    /**
     * @param \Exception $exception
     * @return array
     */
    public function transformException(\Exception $exception);
}
