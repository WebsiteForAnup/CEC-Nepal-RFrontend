#!/bin/bash

# This script performs sudo operations that are not automated in the deployment pipeline.
# Run this script on the server after deployment.

echo "### Linking Nginx configuration..."
if [ -f /home/anupadkh/deploy/cec/server/nginx.conf ]; then
    sudo ln -sf /home/anupadkh/deploy/cec/server/nginx.conf /etc/nginx/sites-available/cecnepal
    sudo ln -sf /etc/nginx/sites-available/cecnepal /etc/nginx/sites-enabled/
    echo "Config linked."
else
    echo "Error: nginx.conf not found at /home/anupadkh/deploy/cec/server/nginx.conf"
    exit 1
fi

echo "### Reloading Nginx..."
sudo systemctl reload nginx
echo "Nginx reloaded."
