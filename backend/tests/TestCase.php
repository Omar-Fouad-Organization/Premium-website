<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): \Illuminate\Foundation\Application
    {
        $app = parent::createApplication();
        $database = config('database.connections.mysql.database');
        if (! $app->environment('testing') || config('database.default') !== 'mysql' || $database !== 'green_life_expo_test'
            || ! in_array(config('database.connections.mysql.host'), ['127.0.0.1','localhost'], true)
            || ! empty(config('database.connections.mysql.url'))) {
            throw new \RuntimeException('Tests require the dedicated loopback green_life_expo_test database.');
        }
        if (\Illuminate\Support\Facades\DB::selectOne('SELECT DATABASE() AS name')->name !== 'green_life_expo_test') {
            throw new \RuntimeException('Refusing migrations on an unexpected actual database.');
        }

        return $app;
    }
}
