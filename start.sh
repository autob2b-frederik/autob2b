#!/usr/bin/env bash
# Starts AutoB2B copy in the background on 127.0.0.1:${PORT:-4310}. Ensures admins (no demo cars).
cd "$(dirname "$0")"
node scripts/seed.js 2>/dev/null || true
if [ -f server.pid ] && kill -0 "$(cat server.pid)" 2>/dev/null; then echo "Already running (pid $(cat server.pid))"; exit 0; fi
setsid nohup node server.js >> server.log 2>&1 < /dev/null &
echo $! > server.pid
echo "Started pid $(cat server.pid) on http://127.0.0.1:${PORT:-4310}"
