#!/bin/bash

domains=(cecnepal.anup.pro.np)
email="anupadkh@gmail.com" # Change this to your email

echo "### Requesting Let's Encrypt certificate for $domains ..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null
then
    echo "certbot could not be found. Please install it (e.g., sudo apt install certbot python3-certbot-nginx)"
    exit 1
fi

# Obtain certificate using Nginx plugin
sudo certbot --nginx -d "${domains[0]}" --email "$email" --agree-tos --non-interactive --redirect

echo "### Reloading nginx ..."
sudo systemctl reload nginx

