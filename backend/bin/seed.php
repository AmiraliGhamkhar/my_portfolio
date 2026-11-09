<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

function split_seed_statements(string $sql): array
{
    $statements = [];
    $buffer = '';
    $quote = null;
    $escaped = false;
    for ($i = 0, $length = strlen($sql); $i < $length; $i++) {
        $char = $sql[$i];
        $next = $i + 1 < $length ? $sql[$i + 1] : '';
        if ($quote !== null) {
            $buffer .= $char;
            if ($escaped) { $escaped = false; continue; }
            if ($char === '\\' && $quote !== '`') { $escaped = true; continue; }
            if ($char === $quote) {
                if ($next === $quote && $quote !== '`') { $buffer .= $next; $i++; }
                else $quote = null;
            }
            continue;
        }
        if ($char === "'" || $char === '"' || $char === '`') { $quote = $char; $buffer .= $char; continue; }
        if ($char === ';') { if (trim($buffer) !== '') $statements[] = trim($buffer); $buffer = ''; continue; }
        $buffer .= $char;
    }
    if (trim($buffer) !== '') $statements[] = trim($buffer);
    return $statements;
}

$db = app_db();
foreach (glob(dirname(__DIR__) . '/seeds/*.sql') ?: [] as $file) {
    $name = basename($file);
    $sql = file_get_contents($file);
    if (!is_string($sql)) throw new RuntimeException("Cannot read seed {$name}.");
    fwrite(STDOUT, "Applying idempotent seed: {$name}\n");
    foreach (split_seed_statements($sql) as $statement) $db->exec($statement);
}
fwrite(STDOUT, "Seed content is ready. Existing edited rows were not overwritten.\n");
