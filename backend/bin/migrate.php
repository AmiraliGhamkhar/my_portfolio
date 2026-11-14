<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';
if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "Run this script from the command line.\n");
    exit(1);
}

$db = app_db();
$db->exec('CREATE TABLE IF NOT EXISTS schema_migrations (migration VARCHAR(190) NOT NULL PRIMARY KEY, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
$files = glob(dirname(__DIR__) . '/migrations/*.sql') ?: [];
sort($files, SORT_STRING);
if ($files === []) {
    fwrite(STDERR, "No migration files were found.\n");
    exit(1);
}
foreach ($files as $file) {
    $name = basename($file);
    $check = $db->prepare('SELECT 1 FROM schema_migrations WHERE migration=:migration');
    $check->execute(['migration' => $name]);
    if ($check->fetchColumn()) {
        fwrite(STDOUT, "Already applied: {$name}\n");
        continue;
    }
    fwrite(STDOUT, "Applying: {$name}\n");
    $sql = file_get_contents($file);
    if (!is_string($sql)) throw new RuntimeException("Cannot read migration {$name}.");
    try {
        foreach (app_split_sql_statements($sql) as $statement) $db->exec($statement);
        $insert = $db->prepare('INSERT INTO schema_migrations (migration) VALUES (:migration)');
        $insert->execute(['migration' => $name]);
    } catch (Throwable $error) {
        fwrite(STDERR, "Migration failed: {$name}. The error is recorded in the private PHP log.\n");
        throw $error;
    }
}
fwrite(STDOUT, "Migrations complete.\n");
