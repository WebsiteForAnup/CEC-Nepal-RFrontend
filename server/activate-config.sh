#!/bin/bash

# This script performs sudo operations that are not automated in the deployment pipeline.
# Run this script on the server after deployment.

echo "### Cleaning up old configuration links..."
# Remove potential broken or old links to avoid conflicts
sudo rm -f /etc/nginx/sites-enabled/cecnepal
sudo rm -f /etc/nginx/sites-enabled/cecnepal.conf
sudo rm -f /etc/nginx/sites-available/cecnepal
sudo rm -f /etc/nginx/sites-available/cecnepal.conf

echo "### Copying Nginx configuration..."
# Use CP instead of SYMLINK to avoid file-not-found/permission issues with home directory
CONF_PATH="/home/anupadkh/deploy/cec/server/nginx.conf"

if [ -f "$CONF_PATH" ]; then
    sudo cp "$CONF_PATH" /etc/nginx/sites-available/cecnepal.conf
    # Create the symlink to usage sites-enabled
    sudo ln -sf /etc/nginx/sites-available/cecnepal.conf /etc/nginx/sites-enabled/
    echo "Config copied to /etc/nginx/sites-available/cecnepal.conf and enabled."
    
    # Note: Copying overwrites SSL configuration if Certbot modified the previous file.
    # You may need to re-run 'init-letsencrypt.sh' or 'certbot install' if SSL breaks.
else
    echo "Error: nginx.conf not found at $CONF_PATH"
    ls -la /home/anupadkh/deploy/cec/server/
    exit 1
fi

echo "### Reloading Nginx..."
sudo systemctl reload nginx
echo "Nginx reloaded."
