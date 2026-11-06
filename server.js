'use strict';
const { createApp } = require('./src/app');
const port = Number(process.env.PORT || 4310);
const host = process.env.HOST || '0.0.0.0';
const { app } = createApp({
  cookieSecure: process.env.COOKIE_SECURE === '1',
  ...(process.env.DB_FILE ? { dbFile: process.env.DB_FILE } : {}),
  ...(process.env.UPLOAD_DIR ? { uploadDir: process.env.UPLOAD_DIR } : {}),
});
app.listen(port, host, () => console.log(`AutoB2B kopi kører på http://${host}:${port}`));
