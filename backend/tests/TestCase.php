<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): \Illuminate\Foundation\Application
    {
        $app = parent::createApplication();
        $database = config('database.connections.mysql.database');
        if (config('database.default') !== 'mysql' || ! str_ends_with((string) $database, '_test')) {
            throw new \RuntimeException('Tests require a dedicated MySQL database whose name ends in _test.');
        }

        return $app;
    }
}
