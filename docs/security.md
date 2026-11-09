# Security model and operational controls

This is a practical baseline for a single-origin portfolio CMS, not a substitute for hosting hardening or a third-party security audit. PHP runtime, database, and Apache behavior must be tested on the production-compatible host before deployment is considered complete.

## Application controls

- **Credentials and private files:** no production passwords or application keys are committed. Keep `config.php`, PHP source, rate-limit state, and logs outside the document root. `config.example.php` uses environment variables; when cPanel cannot inject environment values, store the real values only in a private `config.php` with restrictive permissions.
- **Admin authentication:** password hashes use PHP `password_hash()` / `password_verify()`. New passwords require at least 12 characters and are capped at 72 UTF-8 bytes to avoid bcrypt truncation under the current `PASSWORD_DEFAULT`. There is no public registration route. The initial admin is created interactively with the CLI script. Disabled accounts are denied.
- **Sessions:** `AGPORTALSESSID` is `HttpOnly`, `SameSite=Strict`, scoped to `/api/v1`, and `Secure` when PHP sees trusted HTTPS. Session IDs and CSRF tokens rotate after login and password change. Keep HTTPS enabled and do not enable proxy HTTPS trust unless the proxy is trusted.
- **CSRF and origin checks:** all state-changing public/admin requests require a session CSRF token in `X-CSRF-Token`. A supplied `Origin` must match the configured origin. The API does not enable cross-origin access.
- **Abuse controls:** contact, login, and upload routes use per-IP file-backed rate limits. The file names use an HMAC-derived IP hash keyed by `PORTFOLIO_APP_KEY`; raw IP addresses are not written to the message table. Rate-limit state and API error logs belong in a private, writable directory.
- **Database writes:** PDO uses exception mode and native prepared statements. Writable resource tables/columns are selected from fixed server-side maps; request data never supplies SQL identifiers. Validation bounds text to column limits, restricts URL schemes to HTTP(S), validates slugs/enums/IDs, and strips HTML tags because stored content is rendered as plain text.
- **Uploads:** Fileinfo MIME detection allows JPEG, PNG, WebP, and AVIF up to 6 MB. Names are random, SVG/scripts are rejected, upload directories disable indexing and script execution, and media deletion is blocked while referenced. The PHP upload directory must remain writable but non-executable.
- **Browser hardening:** Apache rules set `nosniff`, frame denial, referrer and permissions policies, a same-origin Content Security Policy, HSTS, static cache headers, and compression. Locale/admin deep links fall back to static HTML. The API does not expose stack traces to clients.

## Host configuration checklist

1. Use maintained PHP 8.2+, MySQL/MariaDB, Apache, and cPanel versions; apply security updates.
2. Force HTTPS and verify the canonical host. Set `allowed_origin` to the exact HTTPS origin.
3. Keep private source/config/data outside `public_html`; never chmod private data or uploads to `777`.
4. Use a dedicated database user. Grant migration privileges only as needed; use backups and review queries/logs after changes.
5. Ensure the account/PHP user can write only to the private rate-limit/log directory and the image upload directory.
6. Confirm `mod_rewrite`, `mod_headers`, `mod_deflate`, and `mod_expires` are active. A `.htaccess` syntax or override mismatch can cause a 500 response.
7. Verify that the host honors `public/api/.user.ini`; if not, set equivalent upload and post limits in cPanel.
8. Back up the database, private config, and uploads. Rotate the database password and application key if exposed; key rotation resets the old rate-limit HMAC filenames.

## Important limitations

- File-backed rate limiting is suitable for one account/server. It is not a shared distributed limiter for multiple web nodes; use a shared store before scaling horizontally.
- The API stores contact messages but does not send mail. Protect the admin account and define a retention policy for messages and logs.
- No browser, PHP runtime, MySQL, or Apache integration tests were available in the implementation workspace. See [verification notes](testing.md) and complete the deployment smoke tests before launch.
- The default seed content uses verified public repository descriptions and placeholder profile elements. The abstract portrait is not a real likeness. Review every public profile, URL, and translation before publishing.
