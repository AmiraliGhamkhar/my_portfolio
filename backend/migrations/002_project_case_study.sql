-- 002_project_case_study
-- Adds the structured case-study fields used by the public project pages and the
-- one-line focus summary used by the capabilities list. Both are optional: when a
-- translation leaves them empty the frontend falls back to its verified static copy.

ALTER TABLE project_translations
  ADD COLUMN problem LONGTEXT NULL AFTER details_json,
  ADD COLUMN solution LONGTEXT NULL AFTER problem,
  ADD COLUMN engineering_json JSON NULL AFTER solution,
  ADD COLUMN outcome LONGTEXT NULL AFTER engineering_json;

ALTER TABLE expertise_translations
  ADD COLUMN focus VARCHAR(500) NOT NULL DEFAULT '' AFTER description;
