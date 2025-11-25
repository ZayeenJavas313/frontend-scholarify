#!/bin/bash
# Script deployment helper untuk Scholarify Frontend (Next.js)

echo "🚀 Scholarify Deployment Helper"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json tidak ditemukan!"
    echo "   Pastikan Anda berada di folder 'company profile scholarify'"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version harus 18 atau lebih tinggi"
    echo "   Versi saat ini: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Gagal install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Check environment variables
if [ -z "$NEXT_PUBLIC_API_BASE_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_API_BASE_URL tidak di-set"
    echo "   Pastikan untuk set environment variable di Netlify"
    echo ""
fi

# Build
echo "🔨 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build gagal!"
    exit 1
fi

echo ""
echo "✅ Build berhasil!"
echo ""
echo "📋 Next Steps:"
echo "   1. Deploy ke Netlify (via CLI atau Dashboard)"
echo "   2. Set environment variable: NEXT_PUBLIC_API_BASE_URL"
echo "   3. Pastikan backend Django sudah di-deploy"
echo "   4. Update CORS di backend dengan domain Netlify"
echo ""
echo "💡 Untuk deploy via Netlify CLI:"
echo "   netlify deploy --prod"
echo ""

