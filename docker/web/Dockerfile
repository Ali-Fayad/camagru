# Apache + PHP 8.1, with DocumentRoot pointing to /var/www/html/public
FROM php:8.1-apache

# Enable required Apache modules
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set Apache DocumentRoot to /var/www/html/public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Replace default vhost: serve index.html by default, route API to index.php
RUN set -e; \
  cat > /etc/apache2/sites-available/000-default.conf <<'EOF'
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/html/public

    <Directory /var/www/html/public>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
        DirectoryIndex index.html index.php

        <IfModule mod_rewrite.c>
            RewriteEngine On

            # Serve static files directly
            RewriteCond %{REQUEST_FILENAME} -f
            RewriteRule ^ - [L]

            # Route API requests to index.php
            RewriteCond %{REQUEST_URI} ^/api/
            RewriteRule ^ index.php [L]

            # Everything else serves index.html (SPA)
            RewriteRule ^ index.html [L]
        </IfModule>
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Copy project files into the image to avoid permission issues
COPY ./Server /var/www/html

# Set proper ownership
RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html
