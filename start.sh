#!/usr/bin/env bash
# Starts AutoB2B copy in the background on 127.0.0.1:${PORT:-4310}. Seeds admin on first run.
cd "$(dirname "$0")"
[ -f data/autob2b.sqlite ] || node scripts/seed.js --samples 2>/dev/null
if [ -f server.pid ] && kill -0 "$(cat server.pid)" 2>/dev/null; then echo "Already running (pid $(cat server.pid))"; exit 0; fi
setsid nohup node server.js >> server.log 2>&1 < /dev/null &
echo $! > server.pid
echo "Started pid $(cat server.pid) on http://127.0.0.1:${PORT:-4310}"
