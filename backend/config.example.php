<?php

declare(strict_types=1);

/*
 * Copy this file to config.php in the private application directory. Do not put
 * config.php under public_html or commit real credentials to source control.
 */
return [
    'db' => [
        'host' => getenv('DB_HOST') ?: 'localhost',
        'name' => getenv('DB_NAME') ?: 'portfolio_db',
        'user' => getenv('DB_USER') ?: 'portfolio_user',
        'password' => getenv('DB_PASSWORD') ?: '',
        'charset' => 'utf8mb4',
    ],
    'app_key' => getenv('PORTFOLIO_APP_KEY') ?: '', // generate a random 32+ character value
    'data_dir' => getenv('PORTFOLIO_DATA_DIR') ?: dirname(__DIR__) . '/portfolio-private-data',
    'upload_dir' => getenv('PORTFOLIO_UPLOAD_DIR') ?: dirname(__DIR__) . '/public_html/uploads',
    'upload_url' => getenv('PORTFOLIO_UPLOAD_URL') ?: '/uploads',
    'allowed_origin' => getenv('PORTFOLIO_ORIGIN') ?: 'https://amiralighamkhar.ir',
    'trust_proxy_https' => filter_var(getenv('TRUST_PROXY_HTTPS') ?: '0', FILTER_VALIDATE_BOOL),
    'max_upload_bytes' => 6 * 1024 * 1024,
];
