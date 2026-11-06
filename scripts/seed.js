'use strict';
// Ensures BOTH admins (fixed passwords). Optional DEMO data only with --samples (never used on boot/Render).
const path = require('node:path');
const { openDb } = require('../src/db');
const { ensureAdmins } = require('../src/ensure-admins');

const root = path.join(__dirname, '..');
const db = openDb(path.join(root, 'data', 'autob2b.sqlite'));
const emails = ensureAdmins(db);
console.log('Admins sikret:', emails.join(', '));

if (process.argv.includes('--samples') && !db.prepare(`SELECT 1 FROM vehicles WHERE vin LIKE 'DEMO%'`).get()) {
  const ins = db.prepare(`INSERT INTO vehicles (vin,make,model,variant,first_registration,mileage,fuel,transmission,color,price,images,condition_report_url) VALUES (?,?,?,?,?,?,?,?,?,?,'[]',NULL)`);
  const cars = [
    ['DEMO0000000000001', 'Demo-Volkswagen', 'Golf', '2.0 TDI (DEMO)', '2021-05-10', 58000, 'diesel', 'manual', 'Sort', 142000],
    ['DEMO0000000000002', 'Demo-BMW', 'i4', 'eDrive40 (DEMO)', '2022-03-01', 31000, 'el', 'automatic', 'Hvid', 285000],
    ['DEMO0000000000003', 'Demo-Audi', 'A3', '35 TFSI (DEMO)', '2020-09-15', 72000, 'benzin', 'automatic', 'Grå', 158000],
    ['DEMO0000000000004', 'Demo-Toyota', 'Corolla', 'Hybrid (DEMO)', '2022-01-20', 40000, 'hybrid', 'automatic', 'Blå', 165000],
  ];
  const ids = cars.map((c) => Number(ins.run(...c).lastInsertRowid));
  const pk = Number(db.prepare(`INSERT INTO packages (name,total_price,description) VALUES (?,?,?)`).run('DEMO Parti 2 biler', 295000, 'Demo-parti med to fiktive biler').lastInsertRowid);
  [ids[0], ids[2]].forEach((v) => db.prepare('INSERT INTO package_vehicles (package_id,vehicle_id) VALUES (?,?)').run(pk, v));
  console.log('Demo-data tilføjet (VIN starter med DEMO).');
}
