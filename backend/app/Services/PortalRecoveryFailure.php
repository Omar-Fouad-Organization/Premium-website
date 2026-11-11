<?php

namespace App\Services;

class PortalRecoveryFailure extends \RuntimeException
{
    public function __construct(public readonly string $category)
    {
        parent::__construct('Recovery mail transport did not confirm acceptance.');
    }
}
