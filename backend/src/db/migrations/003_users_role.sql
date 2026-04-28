-- Voegt role-kolom toe aan users-tabel voor RBAC. Default 'user' zodat
-- bestaande rijen in seed-DB's geen migratie-fout opleveren. CHECK-constraint
-- houdt de set gesloten op admin/user; uitbreiden vereist een nieuwe migratie
-- (CHECK is niet ALTERbaar in SQLite).
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('admin', 'user'));

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
