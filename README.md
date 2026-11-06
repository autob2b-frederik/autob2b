# AutoB2B – lokal kopi
Node 24 (node:sqlite) + Express 5, vanilla JS SPA (dansk, grøn/hvid). Ingen publicering.
- Start: `./start.sh` (http://127.0.0.1:4310, log i server.log, pid i server.pid) · Stop: `./stop.sh`
- Første start seeder admin + demo-data (`node scripts/seed.js --samples`); login i ADMIN_LOGIN.txt
- Test: `npm test`
- Miljø: PORT, HOST, DB_FILE, UPLOAD_DIR, COOKIE_SECURE=1 (bag HTTPS)
