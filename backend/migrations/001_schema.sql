CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  display_name VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  password_changed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email),
  KEY idx_admin_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile (
  id TINYINT UNSIGNED NOT NULL,
  email VARCHAR(254) NOT NULL DEFAULT '',
  github_url VARCHAR(1000) NOT NULL DEFAULT 'https://github.com/AmiraliGhamkhar',
  linkedin_url VARCHAR(1000) NOT NULL DEFAULT '',
  portrait_url VARCHAR(1000) NOT NULL DEFAULT '',
  portrait_media_id BIGINT UNSIGNED NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile_translations (
  profile_id TINYINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  name VARCHAR(200) NOT NULL DEFAULT '',
  role VARCHAR(300) NOT NULL DEFAULT '',
  hero_greeting VARCHAR(300) NOT NULL DEFAULT '',
  statement VARCHAR(600) NOT NULL DEFAULT '',
  about LONGTEXT NOT NULL,
  seo_title VARCHAR(300) NOT NULL DEFAULT '',
  seo_description VARCHAR(500) NOT NULL DEFAULT '',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (profile_id, language),
  CONSTRAINT fk_profile_translation_profile FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
  CONSTRAINT chk_profile_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) NOT NULL,
  value_json JSON NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  category_key VARCHAR(100) NOT NULL DEFAULT '',
  cover_url VARCHAR(1000) NOT NULL DEFAULT '',
  cover_media_id BIGINT UNSIGNED NULL,
  github_url VARCHAR(1000) NOT NULL DEFAULT '',
  live_url VARCHAR(1000) NOT NULL DEFAULT '',
  video_url VARCHAR(1000) NOT NULL DEFAULT '',
  featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_slug (slug),
  KEY idx_projects_status_order (status, sort_order),
  KEY idx_projects_featured (featured, status),
  CONSTRAINT chk_projects_slug CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_translations (
  project_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(240) NOT NULL DEFAULT '',
  category VARCHAR(160) NOT NULL DEFAULT '',
  summary VARCHAR(1000) NOT NULL DEFAULT '',
  description LONGTEXT NOT NULL,
  details_json JSON NULL,
  seo_title VARCHAR(300) NOT NULL DEFAULT '',
  seo_description VARCHAR(500) NOT NULL DEFAULT '',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, language),
  CONSTRAINT fk_project_translation_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT chk_project_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  media_id BIGINT UNSIGNED NULL,
  image_url VARCHAR(1000) NOT NULL DEFAULT '',
  alt_fa VARCHAR(300) NOT NULL DEFAULT '',
  alt_en VARCHAR(300) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_project_images_order (project_id, sort_order),
  CONSTRAINT fk_project_images_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS technologies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  category VARCHAR(120) NOT NULL DEFAULT '',
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_technologies_slug (slug), KEY idx_technologies_order (status, category, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS technology_translations (
  technology_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  name VARCHAR(160) NOT NULL DEFAULT '',
  description VARCHAR(500) NOT NULL DEFAULT '',
  PRIMARY KEY (technology_id, language),
  CONSTRAINT fk_technology_translation_technology FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
  CONSTRAINT chk_technology_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id BIGINT UNSIGNED NOT NULL,
  technology_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (project_id, technology_id),
  CONSTRAINT fk_project_technologies_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_technologies_technology FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expertise (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  icon VARCHAR(40) NOT NULL DEFAULT 'sparkles',
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_expertise_slug (slug), KEY idx_expertise_order (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expertise_translations (
  expertise_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(220) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  PRIMARY KEY (expertise_id, language),
  CONSTRAINT fk_expertise_translation_expertise FOREIGN KEY (expertise_id) REFERENCES expertise(id) ON DELETE CASCADE,
  CONSTRAINT chk_expertise_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS experience (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  start_date VARCHAR(32) NOT NULL DEFAULT '',
  end_date VARCHAR(32) NOT NULL DEFAULT '',
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_experience_order (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS experience_translations (
  experience_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(240) NOT NULL DEFAULT '',
  organization VARCHAR(240) NOT NULL DEFAULT '',
  location VARCHAR(180) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  PRIMARY KEY (experience_id, language),
  CONSTRAINT fk_experience_translation_experience FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE,
  CONSTRAINT chk_experience_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS education (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  start_date VARCHAR(32) NOT NULL DEFAULT '',
  end_date VARCHAR(32) NOT NULL DEFAULT '',
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_education_order (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS education_translations (
  education_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(240) NOT NULL DEFAULT '',
  institution VARCHAR(240) NOT NULL DEFAULT '',
  location VARCHAR(180) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  PRIMARY KEY (education_id, language),
  CONSTRAINT fk_education_translation_education FOREIGN KEY (education_id) REFERENCES education(id) ON DELETE CASCADE,
  CONSTRAINT chk_education_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_research_slug (slug), KEY idx_research_order (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS research_translations (
  research_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(240) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  PRIMARY KEY (research_id, language),
  CONSTRAINT fk_research_translation_research FOREIGN KEY (research_id) REFERENCES research(id) ON DELETE CASCADE,
  CONSTRAINT chk_research_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS publications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  doi VARCHAR(300) NOT NULL DEFAULT '',
  url VARCHAR(1000) NOT NULL DEFAULT '',
  published_at VARCHAR(32) NOT NULL DEFAULT '',
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_publications_order (status, sort_order), KEY idx_publications_doi (doi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS publication_translations (
  publication_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(500) NOT NULL DEFAULT '',
  abstract LONGTEXT NOT NULL,
  authors VARCHAR(1000) NOT NULL DEFAULT '',
  venue VARCHAR(300) NOT NULL DEFAULT '',
  seo_title VARCHAR(300) NOT NULL DEFAULT '',
  seo_description VARCHAR(500) NOT NULL DEFAULT '',
  PRIMARY KEY (publication_id, language),
  CONSTRAINT fk_publication_translation_publication FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
  CONSTRAINT chk_publication_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS achievements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  kind VARCHAR(80) NOT NULL DEFAULT '',
  issuer_url VARCHAR(1000) NOT NULL DEFAULT '',
  awarded_at VARCHAR(32) NOT NULL DEFAULT '',
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_achievements_order (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS achievements_translations (
  achievement_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  title VARCHAR(240) NOT NULL DEFAULT '',
  issuer VARCHAR(240) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  PRIMARY KEY (achievement_id, language),
  CONSTRAINT fk_achievement_translation_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  CONSTRAINT chk_achievement_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_links (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  platform VARCHAR(80) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_social_links_order (is_visible, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_link_translations (
  social_link_id BIGINT UNSIGNED NOT NULL,
  language CHAR(2) NOT NULL,
  label VARCHAR(160) NOT NULL DEFAULT '',
  PRIMARY KEY (social_link_id, language),
  CONSTRAINT fk_social_link_translation_link FOREIGN KEY (social_link_id) REFERENCES social_links(id) ON DELETE CASCADE,
  CONSTRAINT chk_social_link_translation_language CHECK (language IN ('fa','en'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  subject VARCHAR(240) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status ENUM('unread','read','archived') NOT NULL DEFAULT 'unread',
  ip_hash CHAR(64) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), KEY idx_contact_messages_status_date (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_library (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  storage_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL DEFAULT '',
  public_url VARCHAR(1000) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  alt_fa VARCHAR(300) NOT NULL DEFAULT '',
  alt_en VARCHAR(300) NOT NULL DEFAULT '',
  uploaded_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_media_storage_name (storage_name), KEY idx_media_created_at (created_at),
  CONSTRAINT fk_media_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS schema_migrations (
  migration VARCHAR(190) NOT NULL,
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (migration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
