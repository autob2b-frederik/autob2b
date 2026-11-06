'use strict';
const { hashPassword } = require('./auth');

/** Fixed admins for standalone/Render. Seed/boot bypasses API 10-char checkPassword. */
const ADMINS = [
  { email: 'frederikschrooder@gmail.com', name: 'frederik schrøder', password: 'ERIKbataler123!' },
  { email: 'jan@b2b.dk', name: 'Jan', password: '0000' },
];

function ensureAdmins(db) {
  const sel = db.prepare('SELECT id FROM users WHERE email=? COLLATE NOCASE');
  const ins = db.prepare(
    `INSERT INTO users (email,name,password_hash,role,status) VALUES (?,?,?,'admin','approved')`
  );
  const upd = db.prepare(
    `UPDATE users SET name=?, password_hash=?, role='admin', status='approved' WHERE email=? COLLATE NOCASE`
  );
  for (const a of ADMINS) {
    const hash = hashPassword(a.password);
    if (sel.get(a.email)) upd.run(a.name, hash, a.email);
    else ins.run(a.email, a.name, hash);
  }
  purgeDemoInventory(db);
  return ADMINS.map((a) => a.email);
}

function purgeDemoInventory(db) {
  const demoPkgs = db.prepare(
    `SELECT id FROM packages WHERE name LIKE 'DEMO%' COLLATE NOCASE OR name LIKE '%demo-parti%' COLLATE NOCASE OR name LIKE '%Demo-parti%' COLLATE NOCASE`
  ).all();
  const delPv = db.prepare('DELETE FROM package_vehicles WHERE package_id=?');
  const delPkg = db.prepare('DELETE FROM packages WHERE id=?');
  for (const p of demoPkgs) { delPv.run(p.id); delPkg.run(p.id); }
  // Also unlink any package_vehicles pointing at DEMO vins, then delete vehicles
  db.prepare(
    `DELETE FROM package_vehicles WHERE vehicle_id IN (SELECT id FROM vehicles WHERE vin LIKE 'DEMO%')`
  ).run();
  const r = db.prepare(`DELETE FROM vehicles WHERE vin LIKE 'DEMO%'`).run();
  return { packages: demoPkgs.length, vehicles: Number(r.changes || 0) };
}

module.exports = { ensureAdmins, purgeDemoInventory, ADMINS };
