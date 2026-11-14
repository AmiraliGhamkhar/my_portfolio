<?php

declare(strict_types=1);

function app_resource_map(): array
{
    return [
        'projects' => [
            'table' => 'projects', 'translation_table' => 'project_translations', 'foreign_key' => 'project_id',
            'base_fields' => ['slug' => 'slug', 'status' => 'status', 'category_key' => 'text_100', 'cover_url' => 'asset_url', 'cover_media_id' => 'nullable_id', 'github_url' => 'url', 'live_url' => 'url', 'video_url' => 'url', 'featured' => 'bool', 'sort_order' => 'int', 'published_at' => 'datetime'],
            'translation_fields' => ['title' => 'text_240', 'category' => 'text_160', 'summary' => 'text_1000', 'description' => 'long_text', 'details' => 'json_array', 'seo_title' => 'text_300', 'seo_description' => 'text_500'],
            'required' => ['slug'], 'order' => 'sort_order ASC, id ASC',
        ],
        'expertise' => [
            'table' => 'expertise', 'translation_table' => 'expertise_translations', 'foreign_key' => 'expertise_id',
            'base_fields' => ['slug' => 'slug', 'icon' => 'text_40', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['title' => 'text_220', 'description' => 'long_text'],
            'required' => ['slug'], 'order' => 'sort_order ASC, id ASC',
        ],
        'technologies' => [
            'table' => 'technologies', 'translation_table' => 'technology_translations', 'foreign_key' => 'technology_id',
            'base_fields' => ['slug' => 'slug', 'category' => 'text_120', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['name' => 'text_160', 'description' => 'text_500'],
            'required' => ['slug'], 'order' => 'sort_order ASC, category ASC, id ASC',
        ],
        'experience' => [
            'table' => 'experience', 'translation_table' => 'experience_translations', 'foreign_key' => 'experience_id',
            'base_fields' => ['start_date' => 'text_32', 'end_date' => 'text_32', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['title' => 'text_240', 'organization' => 'text_240', 'location' => 'text_180', 'description' => 'long_text'],
            'required' => [], 'order' => 'sort_order ASC, id ASC',
        ],
        'education' => [
            'table' => 'education', 'translation_table' => 'education_translations', 'foreign_key' => 'education_id',
            'base_fields' => ['start_date' => 'text_32', 'end_date' => 'text_32', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['title' => 'text_240', 'institution' => 'text_240', 'location' => 'text_180', 'description' => 'long_text'],
            'required' => [], 'order' => 'sort_order ASC, id ASC',
        ],
        'research' => [
            'table' => 'research', 'translation_table' => 'research_translations', 'foreign_key' => 'research_id',
            'base_fields' => ['slug' => 'slug', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['title' => 'text_240', 'description' => 'long_text'],
            'required' => ['slug'], 'order' => 'sort_order ASC, id ASC',
        ],
        'publications' => [
            'table' => 'publications', 'translation_table' => 'publication_translations', 'foreign_key' => 'publication_id',
            'base_fields' => ['doi' => 'text_300', 'url' => 'url', 'published_at' => 'text_32', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['title' => 'text_500', 'abstract' => 'long_text', 'authors' => 'text_1000', 'venue' => 'text_300', 'seo_title' => 'text_300', 'seo_description' => 'text_500'],
            'required' => [], 'order' => 'sort_order ASC, id ASC',
        ],
        'achievements' => [
            'table' => 'achievements', 'translation_table' => 'achievements_translations', 'foreign_key' => 'achievement_id',
            'base_fields' => ['kind' => 'text_80', 'issuer_url' => 'url', 'awarded_at' => 'text_32', 'status' => 'status', 'sort_order' => 'int'],
            'translation_fields' => ['title' => 'text_240', 'issuer' => 'text_240', 'description' => 'long_text'],
            'required' => [], 'order' => 'sort_order ASC, id ASC',
        ],
        'social-links' => [
            'table' => 'social_links', 'translation_table' => 'social_link_translations', 'foreign_key' => 'social_link_id',
            'base_fields' => ['platform' => 'text_80', 'url' => 'url', 'is_visible' => 'bool', 'sort_order' => 'int'],
            'translation_fields' => ['label' => 'text_160'],
            'required' => ['platform', 'url'], 'order' => 'sort_order ASC, id ASC',
        ],
    ];
}

function app_text_length(string $text): int
{
    if (function_exists('mb_strlen')) return mb_strlen($text, 'UTF-8');
    $length = preg_match_all('/./us', $text);
    if ($length === false) app_fail(422, 'validation_error', 'A text field must use valid UTF-8.');
    return $length;
}

function app_safe_text(mixed $value, int $limit = 1000, bool $allowEmpty = true): string
{
    if (!is_scalar($value)) app_fail(422, 'validation_error', 'A text field has an invalid value.');
    $text = trim(strip_tags((string) $value));
    if (strlen($text) > $limit * 4) app_fail(422, 'validation_error', 'A text field is too long.');
    if (app_text_length($text) > $limit) app_fail(422, 'validation_error', 'A text field is too long.');
    if ($text === '' && !$allowEmpty) app_fail(422, 'validation_error', 'A required field is empty.');
    return $text;
}

function app_safe_url(mixed $value): string
{
    $url = app_safe_text($value ?? '', 1000);
    if ($url === '') return '';
    if (!filter_var($url, FILTER_VALIDATE_URL)) app_fail(422, 'validation_error', 'A URL is invalid.');
    $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
    if (!in_array($scheme, ['http', 'https'], true)) app_fail(422, 'validation_error', 'Only HTTP and HTTPS links are allowed.');
    return $url;
}

function app_safe_asset_url(mixed $value): string
{
    $url = app_safe_text($value ?? '', 1000);
    if ($url === '') return '';
    if (str_starts_with($url, '/uploads/') && !str_contains($url, '..') && !preg_match('/[\\x00-\\x20]/', $url)) return $url;
    return app_safe_url($url);
}

function app_validate_value(string $type, mixed $value): mixed
{
    if (preg_match('/^text_(\d+)$/', $type, $matches)) return app_safe_text($value ?? '', (int) $matches[1]);
    return match ($type) {
        'slug' => (static function () use ($value): string {
            $slug = strtolower(app_safe_text($value, 120, false));
            if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) app_fail(422, 'validation_error', 'Slugs may contain lowercase letters, numbers, and single hyphens.');
            return $slug;
        })(),
        'email' => (static function () use ($value): string {
            $email = strtolower(app_safe_text($value ?? '', 254));
            if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) app_fail(422, 'validation_error', 'An email address is invalid.');
            return $email;
        })(),
        'long_text' => app_safe_text($value ?? '', 12000),
        'url' => app_safe_url($value),
        'asset_url' => app_safe_asset_url($value),
        'status' => in_array($value, ['draft', 'published'], true) ? $value : app_fail(422, 'validation_error', 'Status must be draft or published.'),
        'bool' => filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE) ?? ((int) $value === 1),
        'int' => (static function () use ($value): int {
            if (!is_numeric($value)) app_fail(422, 'validation_error', 'An order field must be an integer.');
            return max(-100000, min(100000, (int) $value));
        })(),
        'nullable_id' => $value === null || $value === '' ? null : (static function () use ($value): int {
            if (!is_numeric($value) || (int) $value < 1) app_fail(422, 'validation_error', 'A related record id is invalid.');
            return (int) $value;
        })(),
        'datetime' => (static function () use ($value): ?string {
            if ($value === null || $value === '') return null;
            $text = app_safe_text($value, 32);
            $date = DateTimeImmutable::createFromFormat('Y-m-d\TH:i', str_replace('Z', '', $text))
                ?: DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $text);
            if (!$date) app_fail(422, 'validation_error', 'A date/time is invalid.');
            return $date->format('Y-m-d H:i:s');
        })(),
        'json_array' => (static function () use ($value): string {
            if (!is_array($value) || count($value) > 80) app_fail(422, 'validation_error', 'A list field must be a JSON array.');
            $items = [];
            foreach ($value as $item) $items[] = app_safe_text($item, 500, false);
            return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        })(),
        default => app_fail(422, 'validation_error', 'An unsupported field was provided.'),
    };
}

function app_validate_fields(array $fields, array $input): array
{
    $valid = [];
    foreach ($fields as $name => $type) {
        if (array_key_exists($name, $input)) $valid[$name] = app_validate_value($type, $input[$name]);
    }
    return $valid;
}

function app_translation_defaults(array $types): array
{
    $values = [];
    foreach ($types as $name => $type) {
        $column = $name === 'details' ? 'details_json' : $name;
        $values[$column] = $type === 'json_array' ? '[]' : '';
    }
    return $values;
}

function app_read_translations_map(array $spec, array $ids): array
{
    if ($ids === []) return [];
    $fields = array_keys($spec['translation_fields']);
    $select = array_map(static fn(string $f): string => '`' . ($f === 'details' ? 'details_json' : $f) . '`', $fields);
    $fk = $spec['foreign_key'];
    $in = implode(', ', array_fill(0, count($ids), '?'));
    $stmt = app_db()->prepare('SELECT `' . $fk . '` AS record_id, language, ' . implode(', ', $select) . ' FROM `' . $spec['translation_table'] . "` WHERE `{$fk}` IN ({$in})");
    $stmt->execute(array_values($ids));
    $byId = [];
    foreach ($stmt->fetchAll() as $row) {
        $rid = (int) $row['record_id'];
        $language = (string) $row['language'];
        foreach ($fields as $field) {
            $column = $field === 'details' ? 'details_json' : $field;
            $value = $row[$column] ?? '';
            if ($field === 'details') {
                $decoded = is_string($value) ? json_decode($value, true) : null;
                $value = is_array($decoded) ? $decoded : [];
            }
            $byId[$rid][$language][$field] = $value;
        }
    }
    return $byId;
}

function app_project_technology_slugs_map(array $projectIds): array
{
    if ($projectIds === []) return [];
    $in = implode(', ', array_fill(0, count($projectIds), '?'));
    $stmt = app_db()->prepare("SELECT pt.project_id, tech.slug FROM project_technologies pt JOIN technologies tech ON tech.id=pt.technology_id WHERE pt.project_id IN ({$in}) ORDER BY tech.sort_order, tech.id");
    $stmt->execute(array_values($projectIds));
    $byId = [];
    foreach ($stmt->fetchAll() as $row) {
        $slug = (string) ($row['slug'] ?? '');
        if ($slug !== '') $byId[(int) $row['project_id']][] = $slug;
    }
    return $byId;
}

function app_public_collection(string $resource, string $language, ?string $slug = null): array
{
    $map = app_resource_map();
    if (!isset($map[$resource])) app_fail(404, 'not_found', 'This resource was not found.');
    $spec = $map[$resource];
    $statusClause = $resource === 'social-links' ? 'r.is_visible = 1' : "r.status = 'published'";
    $params = ['language' => $language];
    if ($resource === 'projects' && $slug !== null) {
        $statusClause .= ' AND r.slug = :slug';
        $params['slug'] = $slug;
    }
    $mediaJoin = $resource === 'projects' ? ' LEFT JOIN media_library cm ON cm.id = r.cover_media_id' : '';
    $mediaSelect = $resource === 'projects' ? ', cm.public_url AS media_cover_url' : '';
    $sql = 'SELECT t.*, r.*' . $mediaSelect . ' FROM `' . $spec['table'] . '` r JOIN `' . $spec['translation_table'] . '` t ON t.`' . $spec['foreign_key'] . '` = r.id AND t.language = :language' . $mediaJoin . ' WHERE ' . $statusClause . ' ORDER BY r.' . str_replace(', ', ', r.', $spec['order']) . ' LIMIT 500';
    $stmt = app_db()->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    if ($rows === []) return [];

    $projectTechMap = [];
    $projectImageMap = [];
    if ($resource === 'projects') {
        $projectIds = array_map(static fn(array $r): int => (int) $r['id'], $rows);
        $in = implode(', ', array_fill(0, count($projectIds), '?'));
        $techStmt = app_db()->prepare("SELECT pt.project_id, COALESCE(t.name, tl.name) AS value FROM project_technologies pt JOIN technologies tech ON tech.id=pt.technology_id LEFT JOIN technology_translations t ON t.technology_id=tech.id AND t.language=? LEFT JOIN technology_translations tl ON tl.technology_id=tech.id AND tl.language='en' WHERE pt.project_id IN ({$in}) AND tech.status='published' ORDER BY tech.sort_order, tech.id");
        $techStmt->execute(array_merge([$language], $projectIds));
        foreach ($techStmt->fetchAll() as $tRow) {
            $val = (string) ($tRow['value'] ?? '');
            if ($val !== '') $projectTechMap[(int) $tRow['project_id']][] = $val;
        }
        $alt = $language === 'fa' ? 'pi.alt_fa' : 'pi.alt_en';
        $imgStmt = app_db()->prepare("SELECT pi.id, pi.project_id, COALESCE(NULLIF(pi.image_url, ''), m.public_url) AS url, {$alt} AS alt, pi.sort_order FROM project_images pi LEFT JOIN media_library m ON m.id=pi.media_id WHERE pi.project_id IN ({$in}) ORDER BY pi.sort_order, pi.id");
        $imgStmt->execute($projectIds);
        foreach ($imgStmt->fetchAll() as $iRow) {
            $pid = (int) $iRow['project_id'];
            unset($iRow['project_id']);
            $projectImageMap[$pid][] = $iRow;
        }
    }

    foreach ($rows as &$row) {
        $row['id'] = (int) $row['id'];
        if ($resource === 'projects') {
            if (empty($row['cover_url']) && !empty($row['media_cover_url'])) {
                $row['cover_url'] = (string) $row['media_cover_url'];
            }
            $decoded = json_decode((string) ($row['details_json'] ?? '[]'), true);
            $row['details'] = is_array($decoded) ? $decoded : [];
            unset($row['details_json'], $row['category_key'], $row['media_cover_url']);
            $row['featured'] = (bool) $row['featured'];
            $row['technologies'] = $projectTechMap[$row['id']] ?? [];
            $row['images'] = $projectImageMap[$row['id']] ?? [];
        } elseif ($resource === 'expertise') {
            $row['number'] = str_pad((string) max(1, (int) $row['sort_order']), 2, '0', STR_PAD_LEFT);
        } elseif ($resource === 'technologies') {
            $row['category'] = (string) ($row['category'] ?? '');
        } elseif ($resource === 'experience') {
            $row['organization'] = (string) ($row['organization'] ?? '');
        }
        unset($row['password_hash']);
    }
    unset($row);
    return $rows;
}

function app_public_profile(string $language): array
{
    $stmt = app_db()->prepare('SELECT p.email, p.github_url, p.linkedin_url, p.portrait_url, m.public_url AS media_portrait_url, t.name, t.role, t.hero_greeting, t.statement, t.about, t.seo_title, t.seo_description FROM profile p LEFT JOIN profile_translations t ON t.profile_id=p.id AND t.language=:language LEFT JOIN media_library m ON m.id=p.portrait_media_id WHERE p.id=1 LIMIT 1');
    $stmt->execute(['language' => $language]);
    $row = $stmt->fetch();
    if (!$row) return [];
    if (empty($row['portrait_url']) && !empty($row['media_portrait_url'])) $row['portrait_url'] = $row['media_portrait_url'];
    unset($row['media_portrait_url']);
    return $row;
}

function app_public_settings(): array
{
    $allowed = ['global_seo_title_fa', 'global_seo_title_en', 'global_seo_description_fa', 'global_seo_description_en', 'og_image'];
    $placeholders = implode(', ', array_fill(0, count($allowed), '?'));
    $stmt = app_db()->prepare('SELECT setting_key, value_json FROM site_settings WHERE setting_key IN (' . $placeholders . ')');
    $stmt->execute($allowed);
    $settings = [];
    foreach ($stmt->fetchAll() as $row) {
        $value = json_decode((string) $row['value_json'], true);
        if (is_string($value)) $settings[$row['setting_key']] = $value;
    }
    return $settings;
}

function app_admin_record(string $resource, array $spec, int $id): ?array
{
    $stmt = app_db()->prepare('SELECT * FROM `' . $spec['table'] . '` WHERE id=:id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if (!$row) return null;
    $row['id'] = (int) $row['id'];
    $translations = app_read_translations_map($spec, [$id])[$id] ?? [];
    $row['translations'] = ['fa' => $translations['fa'] ?? [], 'en' => $translations['en'] ?? []];
    if ($resource === 'projects') $row['technologies'] = app_project_technology_slugs_map([$id])[$id] ?? [];
    return $row;
}

function app_admin_collection(string $resource, string $query = ''): array
{
    $map = app_resource_map();
    if (!isset($map[$resource])) app_fail(404, 'not_found', 'This admin section was not found.');
    $spec = $map[$resource];
    $rows = app_db()->query('SELECT * FROM `' . $spec['table'] . '` ORDER BY ' . $spec['order'] . ' LIMIT 500')->fetchAll();
    if ($rows === []) return [];

    $ids = array_map(static fn(array $r): int => (int) $r['id'], $rows);
    $translationsById = app_read_translations_map($spec, $ids);
    $techById = $resource === 'projects' ? app_project_technology_slugs_map($ids) : [];

    $items = [];
    foreach ($rows as $row) {
        $id = (int) $row['id'];
        $row['id'] = $id;
        $row['translations'] = [
            'fa' => $translationsById[$id]['fa'] ?? [],
            'en' => $translationsById[$id]['en'] ?? [],
        ];
        if ($resource === 'projects') $row['technologies'] = $techById[$id] ?? [];
        $items[] = $row;
    }

    if ($query !== '') {
        $needle = function_exists('mb_strtolower') ? mb_strtolower($query, 'UTF-8') : strtolower($query);
        $items = array_values(array_filter($items, static function (array $record) use ($needle): bool {
            $haystack = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '';
            $haystack = function_exists('mb_strtolower') ? mb_strtolower($haystack, 'UTF-8') : strtolower($haystack);
            return str_contains($haystack, $needle);
        }));
    }
    return $items;
}

function app_save_translations(array $spec, int $id, mixed $input): void
{
    if (!is_array($input)) return;
    $fk = $spec['foreign_key'];
    $table = $spec['translation_table'];
    $types = $spec['translation_fields'];
    $defaults = app_translation_defaults($types);
    foreach (['fa', 'en'] as $language) {
        if (!isset($input[$language])) continue;
        if (!is_array($input[$language])) app_fail(422, 'validation_error', 'A language translation must be an object.');
        $submitted = [];
        foreach ($types as $field => $type) {
            if (array_key_exists($field, $input[$language])) {
                $column = $field === 'details' ? 'details_json' : $field;
                $submitted[$column] = app_validate_value($type, $input[$language][$field]);
            }
        }
        if ($submitted === []) continue;
        $check = app_db()->prepare('SELECT 1 FROM `' . $table . '` WHERE `' . $fk . '`=:id AND language=:language LIMIT 1');
        $check->execute(['id' => $id, 'language' => $language]);
        if (!$check->fetchColumn()) {
            $initial = array_merge($defaults, $submitted);
            $columns = array_merge([$fk, 'language'], array_keys($initial));
            $placeholders = array_map(static fn(string $column): string => ':' . $column, $columns);
            $params = array_merge([$fk => $id, 'language' => $language], $initial);
            $insert = app_db()->prepare('INSERT INTO `' . $table . '` (`' . implode('`, `', $columns) . '`) VALUES (' . implode(', ', $placeholders) . ')');
            $insert->execute($params);
        } else {
            $set = [];
            foreach ($submitted as $column => $_) $set[] = '`' . $column . '`=:' . $column;
            $update = app_db()->prepare('UPDATE `' . $table . '` SET ' . implode(', ', $set) . ' WHERE `' . $fk . '`=:id AND language=:language');
            $update->execute($submitted + ['id' => $id, 'language' => $language]);
        }
    }
}

function app_sync_project_technologies(int $projectId, mixed $input): void
{
    if (!is_array($input)) app_fail(422, 'validation_error', 'Project technologies must be a list.');
    $db = app_db();
    $slugs = array_values(array_unique(array_map(static fn(mixed $tech): string => strtolower(app_safe_text($tech, 120, false)), array_slice($input, 0, 40))));
    $ids = [];
    if ($slugs !== []) {
        $in = implode(', ', array_fill(0, count($slugs), '?'));
        $stmt = $db->prepare("SELECT slug, id FROM technologies WHERE slug IN ({$in})");
        $stmt->execute($slugs);
        $found = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        if (count($found) !== count($slugs)) app_fail(422, 'validation_error', 'Create a technology before assigning it to a project.');
        $ids = array_map('intval', array_values($found));
    }
    $db->prepare('DELETE FROM project_technologies WHERE project_id=:id')->execute(['id' => $projectId]);
    $insert = $db->prepare('INSERT INTO project_technologies (project_id, technology_id) VALUES (:project_id, :technology_id)');
    foreach ($ids as $id) $insert->execute(['project_id' => $projectId, 'technology_id' => $id]);
}

function app_create_record(string $resource, array $spec, array $input): array
{
    $baseInput = isset($input['base']) && is_array($input['base']) ? $input['base'] : $input;
    $base = app_validate_fields($spec['base_fields'], $baseInput);
    foreach ($spec['required'] as $required) {
        if (!isset($base[$required]) || $base[$required] === '') app_fail(422, 'validation_error', 'A required field is missing.');
    }
    $columns = array_keys($base);
    $sql = $columns === []
        ? 'INSERT INTO `' . $spec['table'] . '` () VALUES ()'
        : 'INSERT INTO `' . $spec['table'] . '` (`' . implode('`, `', $columns) . '`) VALUES (:' . implode(', :', $columns) . ')';
    $db = app_db();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($base);
        $id = (int) $db->lastInsertId();
        app_save_translations($spec, $id, $input['translations'] ?? null);
        if ($resource === 'projects' && array_key_exists('technologies', $input)) app_sync_project_technologies($id, $input['technologies']);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        if ($error instanceof PDOException && (string) $error->getCode() === '23000') app_fail(409, 'conflict', 'A record with that unique value already exists.');
        throw $error;
    }
    return app_admin_record($resource, $spec, $id) ?? [];
}

function app_update_record(string $resource, array $spec, int $id, array $input): array
{
    $existing = app_admin_record($resource, $spec, $id);
    if (!$existing) app_fail(404, 'not_found', 'This record was not found.');
    $baseInput = isset($input['base']) && is_array($input['base']) ? $input['base'] : $input;
    $base = app_validate_fields($spec['base_fields'], $baseInput);
    $db = app_db();
    $db->beginTransaction();
    try {
        if ($base !== []) {
            $set = [];
            foreach ($base as $field => $_) $set[] = '`' . $field . '`=:' . $field;
            $base['id'] = $id;
            $db->prepare('UPDATE `' . $spec['table'] . '` SET ' . implode(', ', $set) . ' WHERE id=:id')->execute($base);
        }
        app_save_translations($spec, $id, $input['translations'] ?? null);
        if ($resource === 'projects' && array_key_exists('technologies', $input)) app_sync_project_technologies($id, $input['technologies']);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        if ($error instanceof PDOException && (string) $error->getCode() === '23000') app_fail(409, 'conflict', 'A record with that unique value already exists.');
        throw $error;
    }
    return app_admin_record($resource, $spec, $id) ?? [];
}

function app_save_profile(array $input): array
{
    $db = app_db();
    $baseFields = ['email' => 'email', 'github_url' => 'url', 'linkedin_url' => 'url', 'portrait_url' => 'asset_url', 'portrait_media_id' => 'nullable_id'];
    $profileTranslations = [
        'translation_table' => 'profile_translations', 'foreign_key' => 'profile_id',
        'translation_fields' => [
            'name' => 'text_200', 'role' => 'text_300', 'hero_greeting' => 'text_300', 'statement' => 'text_600', 'about' => 'long_text', 'seo_title' => 'text_300', 'seo_description' => 'text_500',
        ],
    ];
    $db->beginTransaction();
    try {
        $baseInput = isset($input['base']) && is_array($input['base']) ? $input['base'] : $input;
        $base = app_validate_fields($baseFields, $baseInput);
        if ($base !== []) {
            $set = [];
            foreach ($base as $field => $_) $set[] = '`' . $field . '`=:' . $field;
            $base['id'] = 1;
            $db->prepare('UPDATE profile SET ' . implode(', ', $set) . ' WHERE id=1')->execute($base);
        }
        app_save_translations($profileTranslations, 1, $input['translations'] ?? null);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        throw $error;
    }
    return app_admin_profile();
}

function app_admin_profile(): array
{
    $stmt = app_db()->query('SELECT id, email, github_url, linkedin_url, portrait_url, portrait_media_id, updated_at FROM profile WHERE id=1 LIMIT 1');
    $profile = $stmt->fetch() ?: [];
    $profile['translations'] = ['fa' => [], 'en' => []];
    $result = app_db()->query('SELECT language, name, role, hero_greeting, statement, about, seo_title, seo_description FROM profile_translations WHERE profile_id=1');
    foreach ($result->fetchAll() as $row) {
        $lang = $row['language'];
        unset($row['language']);
        $profile['translations'][$lang] = $row;
    }
    return $profile;
}

function app_admin_settings(): array
{
    $rows = app_db()->query('SELECT setting_key, value_json, updated_at FROM site_settings ORDER BY setting_key')->fetchAll();
    foreach ($rows as &$row) {
        $decoded = json_decode((string) $row['value_json'], true);
        $row['value'] = $decoded ?? null;
        unset($row['value_json']);
    }
    unset($row);
    return $rows;
}

function app_save_settings(array $input): array
{
    $settings = $input['settings'] ?? [];
    if (!is_array($settings) || count($settings) > 100) app_fail(422, 'validation_error', 'Settings must be a key/value object.');
    $db = app_db();
    $db->beginTransaction();
    try {
        $stmt = $db->prepare('INSERT INTO site_settings (setting_key, value_json) VALUES (:key, :value) ON DUPLICATE KEY UPDATE value_json=VALUES(value_json)');
        foreach ($settings as $key => $value) {
            $key = (string) $key;
            if (!preg_match('/^[a-z][a-z0-9_.-]{1,99}$/', $key)) app_fail(422, 'validation_error', 'A settings key is invalid.');
            if ($key === 'default_locale' && $value !== 'fa') app_fail(422, 'validation_error', 'Persian is the fixed default locale.');
            if (in_array($key, ['global_seo_title_fa', 'global_seo_title_en'], true)) $value = app_safe_text($value, 300);
            if (in_array($key, ['global_seo_description_fa', 'global_seo_description_en'], true)) $value = app_safe_text($value, 500);
            if ($key === 'og_image') $value = app_safe_asset_url($value);
            $stmt->execute(['key' => $key, 'value' => json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)]);
        }
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        throw $error;
    }
    return app_admin_settings();
}

function app_admin_messages(string $query, int $limit = 500): array
{
    $sql = 'SELECT id, name, email, subject, message, status, created_at FROM contact_messages';
    $params = [];
    if ($query !== '') {
        $escaped = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $query);
        $sql .= " WHERE name LIKE :q ESCAPE '\\\\' OR email LIKE :q ESCAPE '\\\\' OR message LIKE :q ESCAPE '\\\\'";
        $params['q'] = '%' . $escaped . '%';
    }
    $sql .= ' ORDER BY created_at DESC LIMIT ' . max(1, min(500, $limit));
    $stmt = app_db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function app_update_message(int $id, array $input): array
{
    $status = $input['status'] ?? null;
    if (!in_array($status, ['unread', 'read', 'archived'], true)) app_fail(422, 'validation_error', 'A message status is invalid.');
    $stmt = app_db()->prepare('UPDATE contact_messages SET status=:status WHERE id=:id');
    $stmt->execute(['status' => $status, 'id' => $id]);
    if ($stmt->rowCount() === 0) {
        $check = app_db()->prepare('SELECT id FROM contact_messages WHERE id=:id');
        $check->execute(['id' => $id]);
        if (!$check->fetchColumn()) app_fail(404, 'not_found', 'This message was not found.');
    }
    $get = app_db()->prepare('SELECT id, name, email, subject, message, status, created_at FROM contact_messages WHERE id=:id');
    $get->execute(['id' => $id]);
    return $get->fetch() ?: [];
}

function app_admin_media(): array
{
    return app_db()->query('SELECT id, storage_name, original_name, public_url, mime_type, size_bytes, alt_fa, alt_en, created_at FROM media_library ORDER BY created_at DESC LIMIT 500')->fetchAll();
}

function app_upload_media(array $admin): array
{
    app_rate_limit('media-upload', 30, 3600);
    $file = $_FILES['file'] ?? null;
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) app_fail(422, 'upload_failed', 'Choose a valid image file to upload.');
    $maxBytes = (int) app_config('max_upload_bytes', 6 * 1024 * 1024);
    if ((int) ($file['size'] ?? 0) <= 0 || (int) $file['size'] > $maxBytes) app_fail(413, 'upload_too_large', 'Images must be 6 MB or smaller.');
    $tmp = (string) ($file['tmp_name'] ?? '');
    if (!is_uploaded_file($tmp)) app_fail(400, 'upload_failed', 'The uploaded file could not be verified.');
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($tmp);
    $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/avif' => 'avif'];
    if (!is_string($mime) || !isset($extensions[$mime])) app_fail(415, 'unsupported_media', 'Upload a JPEG, PNG, WebP, or AVIF image.');
    $uploadDir = (string) app_config('upload_dir', '');
    if ($uploadDir === '') throw new RuntimeException('Upload directory is not configured.');
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0750, true) && !is_dir($uploadDir)) throw new RuntimeException('Upload directory is unavailable.');
    $name = bin2hex(random_bytes(20)) . '.' . $extensions[$mime];
    $destination = rtrim($uploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;
    if (!move_uploaded_file($tmp, $destination)) throw new RuntimeException('Uploaded image could not be saved.');
    @chmod($destination, 0640);
    $url = rtrim((string) app_config('upload_url', '/uploads'), '/') . '/' . $name;
    $original = basename((string) ($file['name'] ?? 'image'));
    $original = app_safe_text($original, 255);
    $id = 0;
    try {
        $stmt = app_db()->prepare('INSERT INTO media_library (storage_name, original_name, public_url, mime_type, size_bytes, uploaded_by) VALUES (:storage_name, :original_name, :public_url, :mime_type, :size_bytes, :uploaded_by)');
        $stmt->execute(['storage_name' => $name, 'original_name' => $original, 'public_url' => $url, 'mime_type' => $mime, 'size_bytes' => (int) $file['size'], 'uploaded_by' => $admin['id']]);
        $id = (int) app_db()->lastInsertId();
    } catch (Throwable $error) {
        if (is_file($destination)) @unlink($destination);
        throw $error;
    }
    $get = app_db()->prepare('SELECT id, storage_name, original_name, public_url, mime_type, size_bytes, alt_fa, alt_en, created_at FROM media_library WHERE id=:id');
    $get->execute(['id' => $id]);
    return $get->fetch() ?: [];
}

function app_update_media(int $id, array $input): array
{
    $fields = [];
    foreach (['alt_fa', 'alt_en'] as $key) if (array_key_exists($key, $input)) $fields[$key] = app_safe_text($input[$key], 300);
    if ($fields !== []) {
        $set = [];
        foreach ($fields as $key => $_) $set[] = '`' . $key . '`=:' . $key;
        $fields['id'] = $id;
        app_db()->prepare('UPDATE media_library SET ' . implode(', ', $set) . ' WHERE id=:id')->execute($fields);
    }
    $stmt = app_db()->prepare('SELECT id, storage_name, original_name, public_url, mime_type, size_bytes, alt_fa, alt_en, created_at FROM media_library WHERE id=:id');
    $stmt->execute(['id' => $id]);
    $media = $stmt->fetch();
    if (!$media) app_fail(404, 'not_found', 'This media item was not found.');
    return $media;
}

function app_delete_media(int $id): void
{
    $db = app_db();
    $stmt = $db->prepare('SELECT storage_name FROM media_library WHERE id=:id');
    $stmt->execute(['id' => $id]);
    $name = $stmt->fetchColumn();
    if (!$name) app_fail(404, 'not_found', 'This media item was not found.');
    $references = [
        ['profile', 'portrait_media_id'],
        ['projects', 'cover_media_id'],
        ['project_images', 'media_id'],
    ];
    foreach ($references as [$table, $column]) {
        $check = $db->prepare('SELECT 1 FROM `' . $table . '` WHERE `' . $column . '`=:id LIMIT 1');
        $check->execute(['id' => $id]);
        if ($check->fetchColumn()) app_fail(409, 'media_in_use', 'This image is in use. Remove its references before deleting it.');
    }
    $db->prepare('DELETE FROM media_library WHERE id=:id')->execute(['id' => $id]);
    $file = rtrim((string) app_config('upload_dir', ''), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . basename((string) $name);
    if (is_file($file)) @unlink($file);
}

function app_project_images(int $projectId): array
{
    $check = app_db()->prepare('SELECT id FROM projects WHERE id=:id');
    $check->execute(['id' => $projectId]);
    if (!$check->fetchColumn()) app_fail(404, 'not_found', 'This project was not found.');
    $stmt = app_db()->prepare('SELECT pi.id, pi.project_id, pi.media_id, pi.image_url, pi.alt_fa, pi.alt_en, pi.sort_order, m.public_url AS media_url FROM project_images pi LEFT JOIN media_library m ON m.id=pi.media_id WHERE pi.project_id=:id ORDER BY pi.sort_order, pi.id');
    $stmt->execute(['id' => $projectId]);
    return $stmt->fetchAll();
}

function app_add_project_image(int $projectId, array $input): array
{
    $projectCheck = app_db()->prepare('SELECT 1 FROM projects WHERE id=:id');
    $projectCheck->execute(['id' => $projectId]);
    if (!$projectCheck->fetchColumn()) app_fail(404, 'not_found', 'This project was not found.');
    $mediaId = isset($input['media_id']) && is_numeric($input['media_id']) ? (int) $input['media_id'] : null;
    $url = app_safe_asset_url($input['image_url'] ?? '');
    if ($mediaId === null && $url === '') app_fail(422, 'validation_error', 'Select an uploaded image or provide an HTTPS image URL.');
    if ($mediaId !== null) {
        $exists = app_db()->prepare('SELECT public_url FROM media_library WHERE id=:id');
        $exists->execute(['id' => $mediaId]);
        $mediaUrl = $exists->fetchColumn();
        if (!$mediaUrl) app_fail(422, 'validation_error', 'The selected media item does not exist.');
        if ($url === '') $url = (string) $mediaUrl;
    }
    $sort = isset($input['sort_order']) && is_numeric($input['sort_order']) ? (int) $input['sort_order'] : 0;
    $stmt = app_db()->prepare('INSERT INTO project_images (project_id, media_id, image_url, alt_fa, alt_en, sort_order) VALUES (:project_id, :media_id, :image_url, :alt_fa, :alt_en, :sort_order)');
    $stmt->execute([
        'project_id' => $projectId, 'media_id' => $mediaId, 'image_url' => $url,
        'alt_fa' => app_safe_text($input['alt_fa'] ?? '', 300), 'alt_en' => app_safe_text($input['alt_en'] ?? '', 300), 'sort_order' => $sort,
    ]);
    return ['id' => (int) app_db()->lastInsertId()];
}

function app_delete_project_image(int $projectId, int $imageId): void
{
    $stmt = app_db()->prepare('DELETE FROM project_images WHERE id=:image_id AND project_id=:project_id');
    $stmt->execute(['image_id' => $imageId, 'project_id' => $projectId]);
    if ($stmt->rowCount() === 0) app_fail(404, 'not_found', 'This project image was not found.');
}

function app_contact(array $input): array
{
    app_require_csrf();
    app_rate_limit('public-contact', 5, 900);
    if (trim((string) ($input['website'] ?? '')) !== '') return ['received' => true];
    $name = app_safe_text($input['name'] ?? '', 120, false);
    $email = app_safe_text($input['email'] ?? '', 254, false);
    $message = app_safe_text($input['message'] ?? '', 4000, false);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) app_fail(422, 'validation_error', 'Enter a valid email address.');
    if (app_text_length($message) < 10) app_fail(422, 'validation_error', 'The message must be at least 10 characters.');
    $stmt = app_db()->prepare('INSERT INTO contact_messages (name, email, message, ip_hash) VALUES (:name, :email, :message, :ip_hash)');
    $stmt->execute(['name' => $name, 'email' => $email, 'message' => $message, 'ip_hash' => app_client_hash()]);
    return ['received' => true, 'id' => (int) app_db()->lastInsertId()];
}

function app_login(array $input): array
{
    app_require_csrf();
    app_rate_limit('admin-login', 6, 900);
    $emailInput = $input['email'] ?? null;
    $password = $input['password'] ?? null;
    if (!is_string($emailInput) || !is_string($password) || strlen($emailInput) > 254 || strlen($password) > 200) app_fail(401, 'invalid_credentials', 'Email or password is incorrect.');
    $email = strtolower(trim($emailInput));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) app_fail(401, 'invalid_credentials', 'Email or password is incorrect.');
    $stmt = app_db()->prepare('SELECT id, email, display_name, password_hash, is_active FROM admin_users WHERE email=:email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    $hash = $user ? (string) $user['password_hash'] : '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
    $verified = password_verify($password, $hash);
    if (!$user || !(bool) $user['is_active'] || !$verified) app_fail(401, 'invalid_credentials', 'Email or password is incorrect.');
    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int) $user['id'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    app_db()->prepare('UPDATE admin_users SET last_login_at=UTC_TIMESTAMP() WHERE id=:id')->execute(['id' => $user['id']]);
    return [
        'user' => ['id' => (int) $user['id'], 'email' => $user['email'], 'display_name' => $user['display_name']],
        'csrf_token' => (string) $_SESSION['csrf_token'],
    ];
}

function app_change_password(array $admin, array $input): array
{
    app_require_csrf();
    $current = $input['current_password'] ?? null;
    $next = $input['new_password'] ?? null;
    if (!is_string($current) || !is_string($next) || strlen($current) > 200) app_fail(422, 'validation_error', 'Password fields must be valid strings.');
    if (app_text_length($next) < 12 || strlen($next) > 72) app_fail(422, 'validation_error', 'Use at least 12 characters and no more than 72 UTF-8 bytes.');
    $stmt = app_db()->prepare('SELECT password_hash FROM admin_users WHERE id=:id');
    $stmt->execute(['id' => $admin['id']]);
    $hash = $stmt->fetchColumn();
    if (!$hash || !password_verify($current, (string) $hash)) app_fail(403, 'current_password_incorrect', 'The current password is incorrect.');
    $newHash = password_hash($next, PASSWORD_DEFAULT);
    app_db()->prepare('UPDATE admin_users SET password_hash=:hash, password_changed_at=UTC_TIMESTAMP() WHERE id=:id')->execute(['hash' => $newHash, 'id' => $admin['id']]);
    session_regenerate_id(true);
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return ['changed' => true, 'csrf_token' => (string) $_SESSION['csrf_token']];
}

function app_dashboard(): array
{
    $tables = ['projects', 'expertise', 'technologies', 'experience', 'education', 'research', 'publications', 'achievements', 'social_links', 'media_library'];
    $selects = array_map(static fn(string $t): string => "(SELECT COUNT(*) FROM `{$t}`) AS `{$t}`", $tables);
    $selects[] = "(SELECT COUNT(*) FROM contact_messages WHERE status='unread') AS unread_messages";
    $selects[] = "(SELECT COUNT(*) FROM projects WHERE status='published') AS published_projects";
    $row = app_db()->query('SELECT ' . implode(', ', $selects))->fetch() ?: [];
    $counts = array_map('intval', $row);
    return ['counts' => $counts, 'recent_messages' => app_admin_messages('', 5)];
}

function app_dispatch(): never
{
    $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
    $uri = (string) ($_SERVER['REQUEST_URI'] ?? '/api/v1/health');
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';
    $path = preg_replace('#^/api/v1/?#', '', $path) ?? '';
    $path = trim($path, '/');
    $segments = $path === '' ? [] : explode('/', $path);
    $language = app_lang();

    if ($method === 'GET' && $segments === ['health']) {
        app_db()->query('SELECT 1');
        app_respond(['status' => 'ok']);
    }
    if ($method === 'GET' && $segments === ['csrf']) app_respond(['csrf_token' => app_csrf_token()]);
    if ($method === 'GET' && $segments === ['profile']) app_respond(app_public_profile($language));
    if ($method === 'GET' && $segments === ['settings']) app_respond(app_public_settings());
    if ($method === 'GET' && count($segments) >= 1 && in_array($segments[0], ['projects', 'expertise', 'technologies', 'experience', 'education', 'research', 'publications', 'achievements', 'social-links'], true)) {
        $resource = $segments[0];
        if ($resource === 'projects' && count($segments) === 2) {
            $items = app_public_collection('projects', $language, $segments[1]);
            if ($items !== []) app_respond($items[0]);
            app_fail(404, 'not_found', 'This project was not found.');
        }
        if (count($segments) !== 1) app_fail(404, 'not_found', 'This resource was not found.');
        app_respond(['items' => app_public_collection($resource, $language)]);
    }
    if ($method === 'POST' && $segments === ['contact']) app_respond(app_contact(app_json_body()), 201);

    if (($segments[0] ?? '') !== 'admin') app_fail(404, 'not_found', 'This API route was not found.');
    $adminPath = array_slice($segments, 1);

    if ($method === 'GET' && $adminPath === ['csrf']) app_respond(['csrf_token' => app_csrf_token()]);
    if ($method === 'POST' && $adminPath === ['login']) app_respond(app_login(app_json_body()));
    if ($method === 'GET' && $adminPath === ['me']) {
        $admin = app_admin();
        app_respond(['user' => $admin, 'csrf_token' => app_csrf_token()]);
    }
    if ($method === 'POST' && $adminPath === ['logout']) {
        app_admin();
        app_require_csrf();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', ['expires' => time() - 42000, 'path' => $params['path'], 'secure' => $params['secure'], 'httponly' => true, 'samesite' => 'Strict']);
        }
        session_regenerate_id(true);
        app_respond(['logged_out' => true]);
    }

    $admin = app_admin();
    if ($adminPath === ['dashboard'] && $method === 'GET') app_respond(app_dashboard());
    if ($adminPath === ['profile'] && $method === 'GET') app_respond(app_admin_profile());
    if ($adminPath === ['profile'] && in_array($method, ['PATCH', 'PUT'], true)) {
        app_require_csrf();
        app_respond(app_save_profile(app_json_body()));
    }
    if ($adminPath === ['settings'] && $method === 'GET') app_respond(['items' => app_admin_settings()]);
    if ($adminPath === ['settings'] && in_array($method, ['PATCH', 'PUT'], true)) {
        app_require_csrf();
        app_respond(['items' => app_save_settings(app_json_body())]);
    }
    if ($adminPath === ['security', 'password'] && $method === 'POST') app_respond(app_change_password($admin, app_json_body()));

    if (($adminPath[0] ?? '') === 'contact-messages') {
        if (count($adminPath) === 1 && $method === 'GET') app_respond(['items' => app_admin_messages(app_safe_text($_GET['q'] ?? '', 200))]);
        if (count($adminPath) === 2 && ctype_digit($adminPath[1])) {
            $id = (int) $adminPath[1];
            if ($method === 'PATCH') {
                app_require_csrf();
                app_respond(app_update_message($id, app_json_body()));
            }
            if ($method === 'DELETE') {
                app_require_csrf();
                $stmt = app_db()->prepare('DELETE FROM contact_messages WHERE id=:id');
                $stmt->execute(['id' => $id]);
                if ($stmt->rowCount() === 0) app_fail(404, 'not_found', 'This message was not found.');
                app_respond(['deleted' => true]);
            }
        }
    }

    if (($adminPath[0] ?? '') === 'media') {
        if (count($adminPath) === 1 && $method === 'GET') app_respond(['items' => app_admin_media()]);
        if (count($adminPath) === 1 && $method === 'POST') {
            app_require_csrf();
            app_respond(app_upload_media($admin), 201);
        }
        if (count($adminPath) === 2 && ctype_digit($adminPath[1])) {
            $id = (int) $adminPath[1];
            if ($method === 'PATCH') {
                app_require_csrf();
                app_respond(app_update_media($id, app_json_body()));
            }
            if ($method === 'DELETE') {
                app_require_csrf();
                app_delete_media($id);
                app_respond(['deleted' => true]);
            }
        }
    }

    if (($adminPath[0] ?? '') === 'projects' && count($adminPath) >= 3 && ctype_digit($adminPath[1]) && $adminPath[2] === 'images') {
        $projectId = (int) $adminPath[1];
        if (count($adminPath) === 3 && $method === 'GET') app_respond(['items' => app_project_images($projectId)]);
        if (count($adminPath) === 3 && $method === 'POST') {
            app_require_csrf();
            app_respond(app_add_project_image($projectId, app_json_body()), 201);
        }
        if (count($adminPath) === 4 && ctype_digit($adminPath[3]) && $method === 'DELETE') {
            app_require_csrf();
            app_delete_project_image($projectId, (int) $adminPath[3]);
            app_respond(['deleted' => true]);
        }
    }

    $resource = $adminPath[0] ?? '';
    $map = app_resource_map();
    if (isset($map[$resource])) {
        $spec = $map[$resource];
        if (count($adminPath) === 1 && $method === 'GET') app_respond(['items' => app_admin_collection($resource, app_safe_text($_GET['q'] ?? '', 200))]);
        if (count($adminPath) === 1 && $method === 'POST') {
            app_require_csrf();
            app_respond(app_create_record($resource, $spec, app_json_body()), 201);
        }
        if (count($adminPath) === 2 && ctype_digit($adminPath[1])) {
            $id = (int) $adminPath[1];
            if ($method === 'GET') {
                $record = app_admin_record($resource, $spec, $id);
                if (!$record) app_fail(404, 'not_found', 'This record was not found.');
                app_respond($record);
            }
            if (in_array($method, ['PATCH', 'PUT'], true)) {
                app_require_csrf();
                app_respond(app_update_record($resource, $spec, $id, app_json_body()));
            }
            if ($method === 'DELETE') {
                app_require_csrf();
                $stmt = app_db()->prepare('DELETE FROM `' . $spec['table'] . '` WHERE id=:id');
                $stmt->execute(['id' => $id]);
                if ($stmt->rowCount() === 0) app_fail(404, 'not_found', 'This record was not found.');
                app_respond(['deleted' => true]);
            }
        }
    }

    app_fail(404, 'not_found', 'This API route was not found.');
}

app_dispatch();
