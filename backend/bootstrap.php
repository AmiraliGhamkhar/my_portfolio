<?php

declare(strict_types=1);

$configPath = getenv('PORTFOLIO_CONFIG') ?: __DIR__ . '/config.php';
if (!is_file($configPath)) {
    if (PHP_SAPI !== 'cli') {
        ini_set('display_errors', '0');
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        echo '{"error":{"code":"service_unavailable","message":"Private API configuration is missing."}}';
        exit;
    }
    throw new RuntimeException('Private application configuration is missing.');
}
$GLOBALS['portfolio_config'] = require $configPath;

if (PHP_SAPI !== 'cli') {
    ini_set('display_errors', '0');
    error_reporting(E_ALL);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header('Cache-Control: no-store, private');

    $cfg = $GLOBALS['portfolio_config'];
    $https = (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off')
        || (!empty($cfg['trust_proxy_https']) && ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('AGPORTALSESSID');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/api/v1',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

final class PortfolioApiException extends RuntimeException
{
    public function __construct(public readonly int $status, public readonly string $errorCode, string $message)
    {
        parent::__construct($message);
    }
}

function app_config(?string $key = null, mixed $default = null): mixed
{
    $config = $GLOBALS['portfolio_config'] ?? [];
    return $key === null ? $config : ($config[$key] ?? $default);
}

function app_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $db = app_config('db', []);
    $host = (string) ($db['host'] ?? 'localhost');
    $name = (string) ($db['name'] ?? '');
    $charset = (string) ($db['charset'] ?? 'utf8mb4');
    if ($name === '' || ($db['user'] ?? '') === '' || ($db['password'] ?? '') === '') {
        throw new RuntimeException('Database configuration is incomplete.');
    }
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $host, $name, $charset);
    $pdo = new PDO($dsn, (string) $db['user'], (string) $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
    ]);
    return $pdo;
}

function app_respond(mixed $data, int $status = 200, array $meta = []): never
{
    if (PHP_SAPI !== 'cli') {
        http_response_code($status);
        if (session_status() === PHP_SESSION_ACTIVE) session_write_close();
    }
    $payload = ['data' => $data];
    if ($meta !== []) $payload['meta'] = $meta;
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function app_fail(int $status, string $code, string $message): never
{
    throw new PortfolioApiException($status, $code, $message);
}

function app_json_body(): array
{
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || trim($raw) === '') return [];
    try {
        $data = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        app_fail(400, 'invalid_json', 'The request body must be valid JSON.');
    }
    if (!is_array($data)) app_fail(400, 'invalid_json', 'The request body must be a JSON object.');
    return $data;
}

function app_lang(): string
{
    $language = (string) ($_GET['lang'] ?? 'fa');
    return in_array($language, ['fa', 'en'], true) ? $language : 'fa';
}

function app_require_same_origin(): void
{
    $expected = rtrim((string) app_config('allowed_origin', 'https://amiralighamkhar.ir'), '/');
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        if (!hash_equals($expected, rtrim($origin, '/'))) {
            app_fail(403, 'origin_not_allowed', 'This request origin is not allowed.');
        }
        return;
    }
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer !== '') {
        $parts = parse_url($referer);
        $refererOrigin = isset($parts['scheme'], $parts['host'])
            ? $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '')
            : '';
        if ($refererOrigin === '' || !hash_equals($expected, $refererOrigin)) {
            app_fail(403, 'origin_not_allowed', 'This request origin is not allowed.');
        }
    }
}

function app_csrf_token(): string
{
    if (PHP_SAPI === 'cli') return '';
    if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return (string) $_SESSION['csrf_token'];
}

function app_require_csrf(): void
{
    app_require_same_origin();
    $provided = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $known = (string) ($_SESSION['csrf_token'] ?? '');
    if ($provided === '' || $known === '' || !hash_equals($known, $provided)) {
        app_fail(419, 'csrf_failed', 'The security token is missing or expired. Refresh and try again.');
    }
}

function app_storage_dir(string $suffix = ''): string
{
    $base = (string) app_config('data_dir', dirname(__DIR__) . '/portfolio-private-data');
    $path = rtrim($base, DIRECTORY_SEPARATOR) . ($suffix !== '' ? DIRECTORY_SEPARATOR . $suffix : '');
    if (!is_dir($path) && !mkdir($path, 0750, true) && !is_dir($path)) {
        throw new RuntimeException('Private storage directory could not be created.');
    }
    return $path;
}

function app_client_hash(): string
{
    $address = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = (string) app_config('app_key', '');
    if ($key === '') $key = 'setup-required';
    return hash_hmac('sha256', $address, $key);
}

function app_rate_limit(string $bucket, int $limit, int $windowSeconds): void
{
    $appKey = (string) app_config('app_key', '');
    if (strlen($appKey) < 32) throw new RuntimeException('PORTFOLIO_APP_KEY must be at least 32 characters.');
    $dir = app_storage_dir('rate-limits');
    $now = time();
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . DIRECTORY_SEPARATOR . '*.json') ?: [] as $stale) {
            if (($mtime = @filemtime($stale)) !== false && $now - $mtime > max($windowSeconds, 3600)) @unlink($stale);
        }
    }
    $path = $dir . DIRECTORY_SEPARATOR . hash('sha256', $bucket . ':' . app_client_hash()) . '.json';
    $handle = fopen($path, 'c+');
    if ($handle === false) throw new RuntimeException('Rate limit storage is unavailable.');
    try {
        if (!flock($handle, LOCK_EX)) throw new RuntimeException('Rate limiter could not lock storage.');
        $raw = stream_get_contents($handle);
        $record = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;
        if (!is_array($record) || !isset($record['start'], $record['count']) || $now - (int) $record['start'] >= $windowSeconds) {
            $record = ['start' => $now, 'count' => 0];
        }
        if ((int) $record['count'] >= $limit) {
            $retry = max(1, $windowSeconds - ($now - (int) $record['start']));
            if (PHP_SAPI !== 'cli' && !headers_sent()) header('Retry-After: ' . $retry);
            app_fail(429, 'rate_limited', 'Too many requests. Please wait and try again.');
        }
        $record['count'] = (int) $record['count'] + 1;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($record));
        fflush($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

function app_admin(): array
{
    $id = (int) ($_SESSION['admin_id'] ?? 0);
    if ($id <= 0) app_fail(401, 'unauthorized', 'Please sign in to continue.');
    $stmt = app_db()->prepare('SELECT id, email, display_name, is_active FROM admin_users WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch();
    if (!$user || !(bool) $user['is_active']) {
        $_SESSION = [];
        session_regenerate_id(true);
        app_fail(401, 'unauthorized', 'Please sign in to continue.');
    }
    return [
        'id' => (int) $user['id'],
        'email' => (string) $user['email'],
        'display_name' => (string) $user['display_name'],
    ];
}

function app_split_sql_statements(string $sql): array
{
    $statements = [];
    $buffer = '';
    $quote = null;
    $escaped = false;
    $length = strlen($sql);
    for ($i = 0; $i < $length; $i++) {
        $char = $sql[$i];
        $next = $i + 1 < $length ? $sql[$i + 1] : '';
        if ($quote !== null) {
            $buffer .= $char;
            if ($escaped) {
                $escaped = false;
                continue;
            }
            if ($char === '\\' && $quote !== '`') {
                $escaped = true;
                continue;
            }
            if ($char === $quote) {
                if ($next === $quote && $quote !== '`') {
                    $buffer .= $next;
                    $i++;
                } else {
                    $quote = null;
                }
            }
            continue;
        }
        if ($char === "'" || $char === '"' || $char === '`') {
            $quote = $char;
            $buffer .= $char;
            continue;
        }
        if ($char === ';') {
            if (trim($buffer) !== '') $statements[] = trim($buffer);
            $buffer = '';
            continue;
        }
        $buffer .= $char;
    }
    if (trim($buffer) !== '') $statements[] = trim($buffer);
    return $statements;
}

set_exception_handler(static function (Throwable $error): void {
    if (PHP_SAPI !== 'cli' && session_status() === PHP_SESSION_ACTIVE) session_write_close();
    $status = $error instanceof PortfolioApiException ? $error->status : 500;
    $code = $error instanceof PortfolioApiException ? $error->errorCode : 'internal_error';
    $message = $error instanceof PortfolioApiException ? $error->getMessage() : 'An unexpected error occurred.';
    $logDir = (string) app_config('data_dir', dirname(__DIR__) . '/portfolio-private-data');
    if (!is_dir($logDir)) @mkdir($logDir, 0750, true);
    $line = sprintf("[%s] %s: %s in %s:%d\n", gmdate('c'), get_class($error), $error->getMessage(), $error->getFile(), $error->getLine());
    @file_put_contents(rtrim($logDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'api-errors.log', $line, FILE_APPEND | LOCK_EX);
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: no-store, private');
    }
    echo json_encode(['error' => ['code' => $code, 'message' => $message]], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
});
