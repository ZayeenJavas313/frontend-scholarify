# Troubleshooting: Netlify Deployment Issues

## Masalah: "Situs tidak tersedia - mencapai batas penggunaan"

### Penyebab
Netlify Free Tier memiliki batasan:
- **Build minutes**: 300 menit/bulan
- **Bandwidth**: 100 GB/bulan
- Jika melebihi, situs akan dihentikan sementara

### Solusi

#### 1. Upgrade ke Netlify Pro (Berbayar)
- Buka https://app.netlify.com
- Klik "Upgrade" di dashboard
- Pilih plan yang sesuai (mulai dari $19/bulan)

#### 2. Optimasi Build (Gratis)
- **Hapus build lama**: Site settings → Build & deploy → Clear cache
- **Optimasi dependencies**: Pastikan `node_modules` tidak terlalu besar
- **Gunakan build cache**: Netlify akan otomatis cache dependencies

#### 3. Deploy ulang dengan konfigurasi yang benar

**Langkah-langkah:**

1. **Pastikan konfigurasi benar:**
   - Base directory: `company profile scholarify` (jika repo root adalah parent)
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

2. **Set Environment Variables:**
   - Site settings → Environment variables
   - Tambahkan: `NEXT_PUBLIC_API_BASE_URL` = URL backend Django Anda

3. **Clear cache dan redeploy:**
   - Site settings → Build & deploy → Clear cache
   - Deploys → Trigger deploy → Clear cache and deploy site

## Masalah: Build berhasil tapi situs tidak bisa diakses

### Checklist

1. **Cek Build Logs**
   - Deploys → Pilih deploy terakhir → View build log
   - Pastikan tidak ada error

2. **Cek Publish Directory**
   - Harus: `.next` (untuk Next.js dengan plugin)
   - Jangan: `out` atau `dist`

3. **Cek Plugin**
   - Pastikan `@netlify/plugin-nextjs` terinstall
   - Netlify akan otomatis install saat build pertama kali

4. **Cek Environment Variables**
   - Pastikan `NEXT_PUBLIC_API_BASE_URL` sudah di-set
   - Tanpa ini, frontend akan coba connect ke `localhost:8000`

## Masalah: API tidak terhubung

### Solusi

1. **Set Environment Variable:**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-django-backend.com/api
   ```

2. **Cek CORS di Backend:**
   ```python
   # backend/scholarify/settings.py
   CORS_ALLOWED_ORIGINS = [
       "https://your-site.netlify.app",
       "https://www.your-custom-domain.com",
   ]
   ```

3. **Redeploy setelah set environment variable:**
   - Environment variable baru hanya berlaku setelah redeploy

## Tips Optimasi

### 1. Reduce Build Time
- Gunakan `.netlifyignore` untuk exclude file yang tidak perlu
- Contoh:
  ```
  node_modules
  .git
  .next/cache
  *.log
  ```

### 2. Optimize Dependencies
- Hapus dependencies yang tidak digunakan
- Gunakan `npm prune` sebelum commit

### 3. Use Build Cache
- Netlify otomatis cache `node_modules` jika `package-lock.json` ada
- Pastikan commit `package-lock.json`

## Alternatif: Deploy ke Platform Lain

Jika Netlify free tier tidak cukup, pertimbangkan:

1. **Vercel** (Recommended untuk Next.js)
   - Free tier lebih generous
   - Native Next.js support
   - Auto-deploy dari GitHub

2. **Railway**
   - Free tier: $5 credit/bulan
   - Support full-stack apps

3. **Render**
   - Free tier dengan batasan
   - Auto-deploy dari GitHub

## Quick Fix: Deploy Ulang

1. **Via Dashboard:**
   - Site settings → Build & deploy → Clear cache
   - Deploys → Trigger deploy → Clear cache and deploy site

2. **Via CLI:**
   ```bash
   cd "company profile scholarify"
   netlify deploy --prod --build
   ```

## Kontak Support

Jika masalah masih terjadi:
- Netlify Support: https://www.netlify.com/support/
- Community: https://answers.netlify.com/





