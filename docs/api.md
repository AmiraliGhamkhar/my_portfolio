# HTTP API

The PHP front controller is mounted at `/api/v1`. All endpoints use JSON unless noted. Successful responses are wrapped as `{ "data": ... }`; errors use `{ "error": { "code": "...", "message": "..." } }`. Private error details are written to the configured private log, not returned to the browser.

The API is same-origin only. The browser uses relative paths such as `/api/v1/profile?lang=fa`; do not add a production CORS allowlist or point browser code at a local host.

## Public endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Checks PHP routing and the database connection. |
| `GET` | `/csrf` | Starts/continues a session and returns a token for public state-changing requests. |
| `GET` | `/profile?lang=fa\|en` | Localized profile and public contact/social URLs. |
| `GET` | `/settings` | Allowlisted public SEO defaults and Open Graph image setting. |
| `GET` | `/projects?lang=fa\|en` | Published projects, their localized translations, linked technologies, cover, and gallery. |
| `GET` | `/projects/{slug}?lang=fa\|en` | One published project. |
| `GET` | `/{expertise,technologies,experience,education,research,publications,achievements,social-links}?lang=fa\|en` | Published/visible localized collection. |
| `POST` | `/contact` | Stores a validated contact message. |

The language query parameter is restricted to `fa` and `en`; an absent or invalid value defaults to Persian. Public collection responses have the form `{ "data": { "items": [...] } }`. A single project and profile are returned as an object inside `data`.

Contact requests use JSON:

```json
{
  "name": "Visitor name",
  "email": "visitor@example.com",
  "message": "A message of at least ten characters.",
  "website": ""
}
```

Obtain a CSRF token from `GET /csrf` and send it in `X-CSRF-Token` with the `POST /contact` request. The hidden `website` honeypot should remain empty. A successful submission is saved to `contact_messages` and appears in the CMS; no email is sent by this implementation. Contact attempts are limited to 5 per 15 minutes per client IP.

## Authentication and CSRF

The admin uses a server-side PHP session. The session cookie is `HttpOnly`, `SameSite=Strict`, scoped to `/api/v1`, and marked `Secure` when the HTTPS request is trusted by PHP. Admin writes require both a valid session and an `X-CSRF-Token` header. The API checks the configured same-origin value when an `Origin` header is present.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/admin/csrf` | Starts a pre-login session and returns a login CSRF token. |
| `POST` | `/admin/login` | Authenticates an active admin; rotates the session ID and CSRF token. |
| `GET` | `/admin/me` | Returns the current admin and its CSRF token; requires authentication. |
| `POST` | `/admin/logout` | Invalidates the session; requires authentication and CSRF. |
| `POST` | `/admin/security/password` | Changes the current admin password; requires authentication and CSRF. |

Login accepts `{ "email": "...", "password": "..." }`. Login attempts are limited to 6 per 15 minutes per client IP. New passwords must contain at least 12 characters and no more than 72 UTF-8 bytes (the conservative limit for bcrypt-backed `PASSWORD_DEFAULT`). The first administrator is created with the private CLI script, not through a public registration endpoint.

## Admin content operations

All of the following require an authenticated session. Every `POST`, `PATCH`, `PUT`, and `DELETE` also requires `X-CSRF-Token`.

### Profile and settings

- `GET /admin/profile` — profile base fields and both `fa`/`en` translation objects.
- `PATCH /admin/profile` — accepts `{ "base": { ... }, "translations": { "fa": { ... }, "en": { ... } } }`. Only supplied fields are changed; translations are saved independently.
- `GET /admin/settings` — all CMS settings.
- `PATCH /admin/settings` — accepts `{ "settings": { "global_seo_title_fa": "...", "global_seo_description_en": "...", "og_image": "/uploads/image.webp" } }`. Persian remains the fixed default locale.
- `GET /admin/dashboard` — record counts and recent messages.

### Bilingual resources

For each resource below, use `GET /admin/{resource}`, `POST /admin/{resource}`, `GET /admin/{resource}/{id}`, `PATCH /admin/{resource}/{id}`, and `DELETE /admin/{resource}/{id}`:

- `projects`
- `expertise`
- `technologies`
- `experience`
- `education`
- `research`
- `publications`
- `achievements`
- `social-links`

Create/update payloads support language-isolated fields, for example:

```json
{
  "base": { "slug": "example-project", "status": "draft", "sort_order": 10 },
  "translations": {
    "fa": { "title": "عنوان فارسی", "summary": "خلاصه" },
    "en": { "title": "English title", "summary": "Summary" }
  },
  "technologies": ["react", "typescript"]
}
```

The `technologies` list is supported for projects and contains existing technology slugs. Translation input is partial: editing one language or a subset of its fields does not replace the other language. Resource names, table names, and writable columns are allowlisted server-side; unknown fields are ignored or rejected by the relevant validator.

### Media, galleries, and messages

- `GET /admin/media` — list recent media.
- `POST /admin/media` — multipart form upload with a file field named `file`.
- `PATCH /admin/media/{id}` — update `alt_fa` and/or `alt_en`.
- `DELETE /admin/media/{id}` — refuses deletion while the media item is referenced.
- `GET /admin/projects/{projectId}/images` — list gallery images.
- `POST /admin/projects/{projectId}/images` — accepts `media_id` or `image_url`, optional `alt_fa`, `alt_en`, and `sort_order`.
- `DELETE /admin/projects/{projectId}/images/{imageId}` — remove one gallery item.
- `GET /admin/contact-messages?q=...` — search stored messages.
- `PATCH /admin/contact-messages/{id}` — set status to `unread`, `read`, or `archived`.
- `DELETE /admin/contact-messages/{id}` — delete a message.

Uploads are limited to JPEG, PNG, WebP, and AVIF, MIME-checked with PHP Fileinfo, and capped at 6 MB by the application. Uploaded filenames are random; the original filename is retained only as escaped display metadata.

## Validation and limits

Text input is stripped to plain text and bounded to the matching database column size. URLs permit HTTP(S) only; image assets may also use safe `/uploads/...` paths. Slugs use lowercase ASCII letters, digits, and single hyphens. Enum values, IDs, booleans, date/time formats, JSON arrays, and status values are validated before SQL writes. Database operations use PDO prepared statements; the few dynamic SQL identifiers come from fixed server-side maps.

The route and request list is implemented in `backend/src/router.php`. This documentation describes the current implementation; it is not an OpenAPI specification and does not claim that live PHP/MySQL integration was run in the workspace.
