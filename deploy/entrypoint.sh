#!/bin/sh
set -eu
case "${1:-serve}" in
  serve)
    node scripts/check-env.mjs
    exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port "${PORT:-3000}"
    ;;
  migrate)
    exec node node_modules/prisma/build/index.js migrate deploy
    ;;
  *)
    exec "$@"
    ;;
esac
