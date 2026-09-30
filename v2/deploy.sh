#!/usr/bin/env bash
# Run on the Linux deployment host: bash /var/www/cec-nepal/v2/deploy.sh
# Before first use, edit supervisor.conf and nginx.conf for your host.
# Install nginx.conf separately; this script preserves existing TLS settings.
set -euo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
SUPERVISOR_CONFIG="$APP_DIR/supervisor.conf"
PROGRAM="cec-v2"

fail() {
    printf 'Error: %s\n' "$*" >&2
    exit 1
}

for tool in node npm sudo supervisorctl nginx curl awk; do
    command -v "$tool" >/dev/null 2>&1 || fail "Install $tool before deploying."
done

[[ -f "$APP_DIR/.env" ]] || fail "Restore v2/.env before building."
[[ -f "$APP_DIR/package-lock.json" ]] || fail "package-lock.json is missing."

CONFIGURED_DIR="$(awk -F= '/^directory=/{print substr($0, index($0, "=") + 1)}' "$SUPERVISOR_CONFIG")"
[[ "$CONFIGURED_DIR" == "$APP_DIR" ]] || fail "Set directory=$APP_DIR in supervisor.conf, and match nginx.conf root to $APP_DIR/dist/client."

# Catch existing Nginx errors before changing the application process.
sudo nginx -t

cd -- "$APP_DIR"
printf 'Installing dependencies and building v2...\n'
npm ci --include=dev
npm run typecheck
npm run build

sudo install -d -m 755 /var/log/supervisor
sudo install -m 644 "$SUPERVISOR_CONFIG" /etc/supervisor/conf.d/cec-v2.conf
sudo supervisorctl reread
sudo supervisorctl update "$PROGRAM"
# Restart also picks up a new build when the program configuration is unchanged.
sudo supervisorctl restart "$PROGRAM"

printf 'Checking the SSR server...\n'
curl --fail --silent --show-error --retry 5 --retry-connrefused \
    --retry-delay 2 --max-time 15 http://127.0.0.1:3001/ >/dev/null
sudo supervisorctl status "$PROGRAM"
printf 'v2 is running. Nginx configuration was preserved.\n'
