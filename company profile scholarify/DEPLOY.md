# Panduan Deploy Scholarify ke Netlify

## Persiapan

### 1. Pastikan Backend Django Berjalan
Backend Django harus sudah di-deploy terlebih dahulu (misalnya di Heroku, Railway, atau VPS).

### 2. Environment Variables
Set environment variables di Netlify:
- `NEXT_PUBLIC_API_BASE_URL`: URL backend Django Anda (contoh: `https://your-backend.herokuapp.com/api`)

## Cara Deploy

### Opsi 1: Deploy via Netlify Dashboard

1. **Login ke Netlify**
   - Buka https://app.netlify.com
   - Login dengan GitHub/GitLab/Bitbucket

2. **Connect Repository**
   - Klik "Add new site" → "Import an existing project"
   - Pilih repository GitHub/GitLab/Bitbucket Anda
   - Atau drag & drop folder `company profile scholarify`

3. **Build Settings**
   - **Base directory**: `company profile scholarify` (jika repo root adalah parent folder)
   - **Build command**: `npm run build`
   - **Publish directory**: *(biarkan kosong, plugin Next.js akan handle)*

4. **Environment Variables**
   - Klik "Site settings" → "Environment variables"
   - Tambahkan:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://your-django-backend.herokuapp.com/api
     ```

5. **Deploy**
   - Klik "Deploy site"
   - Tunggu proses build selesai

### Opsi 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Navigate ke folder project**
   ```bash
   cd "company profile scholarify"
   ```

4. **Init Netlify**
   ```bash
   netlify init
   ```
   - Pilih "Create & configure a new site"
   - Pilih team
   - Site name (atau biarkan auto-generated)

5. **Set Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_API_BASE_URL "https://your-django-backend.herokuapp.com/api"
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Setelah Deploy

### 1. Cek Domain
- Netlify akan memberikan domain seperti `your-site.netlify.app`
- Atau setup custom domain di "Domain settings"

### 2. CORS Configuration
Pastikan backend Django mengizinkan domain Netlify:
```python
# backend/scholarify/settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-site.netlify.app",
    "https://www.your-custom-domain.com",
]
```

### 3. Test
- Buka URL Netlify Anda
- Test login dan fitur tryout
- Pastikan API calls berfungsi

## Troubleshooting

### Build Error
- Pastikan Node.js version 18+ di Netlify
- Cek build logs di Netlify dashboard

### API Tidak Terhubung
- Pastikan `NEXT_PUBLIC_API_BASE_URL` sudah di-set
- Cek CORS settings di backend
- Pastikan backend sudah di-deploy dan accessible

### 404 pada Routes
- Pastikan `_redirects` file ada di `public/`
- Atau gunakan `netlify.toml` redirects

## Quick Start (Menggunakan Script Helper)

### Windows (PowerShell)
```powershell
cd "company profile scholarify"
.\deploy.ps1
```

### Linux/Mac (Bash)
```bash
cd "company profile scholarify"
chmod +x deploy.sh
./deploy.sh
```

Script ini akan:
- ✅ Check Node.js version
- ✅ Install dependencies jika belum
- ✅ Build production bundle
- ✅ Memberikan next steps

## File Konfigurasi

Proyek ini sudah include:
- ✅ `netlify.toml` - Konfigurasi build untuk Netlify
- ✅ `public/_redirects` - Redirect rules untuk Next.js
- ✅ `deploy.sh` / `deploy.ps1` - Script helper untuk deployment

## Catatan Penting

1. **Backend harus di-deploy terpisah** (Django tidak bisa di-deploy ke Netlify)
   - Lihat `backend/scholarify/settings_production.py` untuk konfigurasi production
   - Deploy backend ke Heroku, Railway, Render, atau VPS
2. **Environment variables** harus di-set di Netlify dashboard
   - `NEXT_PUBLIC_API_BASE_URL`: URL backend Django (contoh: `https://your-backend.herokuapp.com/api`)
3. **CORS** harus dikonfigurasi di backend untuk mengizinkan domain Netlify
   - Update `CORS_ALLOWED_ORIGINS` di `settings_production.py` dengan domain Netlify Anda
4. **Lihat DEPLOY_CHECKLIST.md** untuk checklist lengkap deployment

## Referensi

- 📋 **DEPLOY_CHECKLIST.md** - Checklist lengkap untuk deployment
- 🔧 **backend/scholarify/settings_production.py** - Settings production untuk Django
- 📖 **Netlify Docs**: https://docs.netlify.com/
- 📖 **Next.js Deployment**: https://nextjs.org/docs/deployment

