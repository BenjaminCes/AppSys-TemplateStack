-- Seed-admin voor lokale ontwikkeling. Email: admin@appsys.local, wachtwoord:
-- appsys00 (bcrypt-hash hieronder, rounds=10). INSERT OR IGNORE zorgt dat
-- herhaalde migraties geen duplicate-key-error geven.
--
-- BEWUST ONVEILIG: dit is een bekende default voor scaffold-projecten. Voor
-- production-deploys: wijzig dit wachtwoord direct na de eerste login en
-- verwijder of roteer deze admin-user in een vervolg-migratie.
INSERT OR IGNORE INTO users (email, password_hash, role)
VALUES (
  'admin@appsys.local',
  '$2a$10$LwXK53KPcUZCqUI6cY.uYOtaDDT0tEqqHIEZUE0fbIJF.KTcKipFK',
  'admin'
);
