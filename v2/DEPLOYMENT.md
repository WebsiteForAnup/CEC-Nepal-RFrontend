# Deploy v2 on Linux

These files assume Ubuntu/Debian with Node, npm, Nginx and Supervisor installed.
Keep this project at `/var/www/cec-nepal/v2`, or edit `supervisor.conf`'s
`directory` and `nginx.conf`'s `root`. Check `command` against `command -v node`.
Supervisor runs the server as `www-data`; that account needs read access to the
project and built files. Run the deployment script as your deployment account
with write access to v2 and sudo access for Supervisor.

Restore `v2/.env` before building. Vite embeds browser-facing environment values
during the build, so rebuild after changing them. Keep private credentials out of
`VITE_*` variables. Never put `.env` in `public` or `dist/client`.

Install `nginx.conf` as `/etc/nginx/sites-available/cec-v2`, enable it through
`sites-enabled`, and configure HTTPS certificates on the host. Disable any
older site configuration claiming the same domain. Validate with `sudo nginx -t`
and reload with `sudo systemctl reload nginx` after editing Nginx.

Run the initial deployment and subsequent rebuilds:

```bash
bash /var/www/cec-nepal/v2/deploy.sh
```

The script installs locked dependencies, checks TypeScript, builds the client
and SSR bundle, installs the Supervisor program configuration, restarts the
process and checks the local HTTP response. It does not overwrite Nginx or TLS
configuration. Deployments rebuild in place; use release directories if you need
zero downtime or automatic rollback.

```bash
sudo supervisorctl status cec-v2
sudo supervisorctl restart cec-v2
sudo supervisorctl stop cec-v2
sudo supervisorctl tail -f cec-v2
```

Keep port `3001` in Supervisor, the script's health check and Nginx in sync.
The production server binds to loopback; Nginx handles public traffic.
