CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_items_title ON items(title);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

INSERT INTO items (slug, title, description, category, status) VALUES
  ('stack', 'Stack', 'Vue 3, Vite, Pinia en Tailwind. Backend Express + sql.js.', 'overview', 'info'),
  ('auth', 'Auth', 'Lokale JWT plus bcrypt. Geen externe identity-provider nodig.', 'overview', 'info'),
  ('backend', 'Backend', 'Express op poort 3001. Routes onder /api.', 'overview', 'info'),
  ('database', 'Database', 'SQLite via sql.js, file-persist op backend/data/app.db.', 'overview', 'info'),
  ('onboarding', 'Onboarding', 'Volg ONBOARDING.md, ~45 minuten van clone tot eerste run.', 'docs', 'info'),
  ('mvp-doc', 'MVP-document', 'Vul docs/MVP.md in zodra je weet wat je gaat bouwen.', 'docs', 'todo'),
  ('stack-standard', 'Stack-standaard', 'Lees docs/STACK-STANDARD.md voor de huisregels.', 'docs', 'info'),
  ('huisstijl', 'Huisstijl', 'Navy plus oranje plus groen. Tokens in tailwind.config.js.', 'design', 'info');
