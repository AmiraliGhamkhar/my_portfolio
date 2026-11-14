<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';
if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "Run this script from the command line.\n");
    exit(1);
}

$db = app_db();
$files = glob(dirname(__DIR__) . '/seeds/*.sql') ?: [];
sort($files, SORT_STRING);
foreach ($files as $file) {
    $name = basename($file);
    $sql = file_get_contents($file);
    if (!is_string($sql)) throw new RuntimeException("Cannot read seed {$name}.");
    fwrite(STDOUT, "Applying idempotent seed: {$name}\n");
    foreach (app_split_sql_statements($sql) as $statement) $db->exec($statement);
}
fwrite(STDOUT, "Seed content is ready. Existing edited rows were not overwritten.\n");
