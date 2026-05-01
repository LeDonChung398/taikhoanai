#!/bin/bash
# Run this ONCE on the server to get SSL certificates.
# After this, just use: docker compose up -d

set -e

DOMAIN="taikhoanai.top"
EMAIL="ledonchung12a2@gmail.com"
DOMAINS="-d taikhoanai.top -d www.taikhoanai.top -d api.taikhoanai.top"
CERTBOT_CONF="./certbot/conf"
CERTBOT_WWW="./certbot/www"

# 1. Tải SSL params của Let's Encrypt
echo "### Downloading Let's Encrypt SSL parameters..."
mkdir -p "$CERTBOT_CONF"
if [ ! -f "$CERTBOT_CONF/options-ssl-nginx.conf" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    -o "$CERTBOT_CONF/options-ssl-nginx.conf"
fi
if [ ! -f "$CERTBOT_CONF/ssl-dhparams.pem" ]; then
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
    -o "$CERTBOT_CONF/ssl-dhparams.pem"
fi

# 2. Tạo cert giả để nginx có thể khởi động lần đầu
echo "### Creating dummy certificate for $DOMAIN..."
LIVE_DIR="$CERTBOT_CONF/live/$DOMAIN"
mkdir -p "$LIVE_DIR"
docker run --rm -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  --entrypoint openssl certbot/certbot \
  req -x509 -nodes -newkey rsa:4096 -days 1 \
  -keyout "/etc/letsencrypt/live/$DOMAIN/privkey.pem" \
  -out "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" \
  -subj "/CN=localhost"

# 3. Khởi động nginx với cert giả
echo "### Starting nginx..."
docker compose up -d nginx

# 4. Xoá cert giả, lấy cert thật từ Let's Encrypt
echo "### Deleting dummy certificate..."
docker run --rm -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  --entrypoint rm certbot/certbot -rf "/etc/letsencrypt/live/$DOMAIN"

echo "### Requesting Let's Encrypt certificate..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  $DOMAINS

# 5. Reload nginx với cert thật
echo "### Reloading nginx..."
docker compose exec nginx nginx -s reload

echo ""
echo "=== Done! SSL certificate obtained successfully. ==="
echo "Now run: docker compose up -d"
