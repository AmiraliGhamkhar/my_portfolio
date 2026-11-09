<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';
if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "Run this script from the command line.\n");
    exit(1);
}

$options = getopt('', ['email:', 'name:']);
$email = strtolower(trim((string) ($options['email'] ?? '')));
$name = trim(strip_tags((string) ($options['name'] ?? 'Portfolio owner')));
if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Usage: php create-admin.php --email=owner@example.com [--name='Portfolio owner']\n");
    exit(1);
}
if ($name === '' || strlen($name) > 160) {
    fwrite(STDERR, "The display name must be between 1 and 160 characters.\n");
    exit(1);
}
$count = (int) app_db()->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
if ($count > 0) {
    fwrite(STDERR, "An administrator already exists. Use Account & Security inside the authenticated CMS.\n");
    exit(1);
}

function read_hidden_password(string $prompt): string
{
    fwrite(STDOUT, $prompt);
    $hidden = false;
    if (function_exists('exec')) {
        @exec('stty -echo 2>/dev/null', $output, $status);
        $hidden = $status === 0;
    }
    $value = fgets(STDIN);
    if ($hidden) @exec('stty echo 2>/dev/null');
    fwrite(STDOUT, "\n");
    return rtrim((string) $value, "\r\n");
}

function password_character_count(string $value): int|false
{
    if (function_exists('mb_strlen')) return mb_strlen($value, 'UTF-8');
    return preg_match_all('/./us', $value);
}

$password = read_hidden_password('New password (12+ characters, max 72 UTF-8 bytes): ');
$confirm = read_hidden_password('Confirm password: ');
$characterCount = password_character_count($password);
if ($characterCount === false || $characterCount < 12 || strlen($password) > 72 || !hash_equals($password, $confirm)) {
    fwrite(STDERR, "Passwords must match, contain at least 12 characters, and use no more than 72 UTF-8 bytes. No administrator was created.\n");
    exit(1);
}
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = app_db()->prepare('INSERT INTO admin_users (email, display_name, password_hash, password_changed_at) VALUES (:email, :display_name, :password_hash, UTC_TIMESTAMP())');
$stmt->execute(['email' => $email, 'display_name' => $name, 'password_hash' => $hash]);
fwrite(STDOUT, "Initial administrator created. Keep this account email private and use the configured HTTPS site.\n");
