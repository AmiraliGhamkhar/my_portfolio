<?php

declare(strict_types=1);

$privateDirectory = getenv('PORTFOLIO_PRIVATE_DIR') ?: dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'portfolio-private';
$bootstrap = rtrim($privateDirectory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'bootstrap.php';
$router = rtrim($privateDirectory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'router.php';

if (!is_file($bootstrap) || !is_file($router)) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo '{"error":{"code":"service_unavailable","message":"The API is not configured yet."}}';
    exit;
}

require $bootstrap;
require $router;
