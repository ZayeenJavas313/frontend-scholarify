"""
Production settings untuk Django backend.
Copy dari settings.py dan sesuaikan untuk production.
"""
from pathlib import Path
import os
from .settings import *  # Import semua dari settings.py

# Override untuk production
DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY', 'CHANGE-THIS-IN-PRODUCTION')

# Allowed hosts - GANTI dengan domain backend Anda
ALLOWED_HOSTS = [
    '.railway.app',  # Allow semua subdomain Railway (paling mudah)
    '.herokuapp.com',  # Allow semua subdomain Heroku
    # Atau spesifik domain:
    # 'your-backend-domain.railway.app',  # Ganti dengan domain Railway Anda
    # 'your-backend-domain.herokuapp.com',  # Ganti dengan domain Heroku Anda
    # 'your-backend-domain.com',  # Custom domain
]

# Database - sesuaikan dengan provider Anda
# Heroku dan Railway biasanya provide DATABASE_URL
import dj_database_url

# Coba gunakan DATABASE_URL dulu (untuk Heroku/Railway)
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL)
    }
else:
    # Fallback ke individual database settings
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', ''),
            'USER': os.environ.get('DB_USER', ''),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', 'localhost'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }

# CORS settings - GANTI dengan domain frontend Netlify Anda
CORS_ALLOWED_ORIGINS = [
    "https://your-site.netlify.app",           # Domain Netlify default
    "https://www.your-custom-domain.com",      # Custom domain (jika ada)
    # Tambahkan domain frontend Anda di sini
]

CORS_ALLOW_CREDENTIALS = True

# Static files (untuk production)
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/static/'

# WhiteNoise untuk serve static files di production
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (untuk upload gambar soal)
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Security settings untuk production
SECURE_SSL_REDIRECT = True  # Redirect HTTP ke HTTPS
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

