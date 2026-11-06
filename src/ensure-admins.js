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
  return ADMINS.map((a) => a.email);
}

module.exports = { ensureAdmins, ADMINS };
