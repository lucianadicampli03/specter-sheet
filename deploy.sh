#!/bin/bash

# SpecterSheet Deployment Script
# Quick deploy to Vercel or Netlify

echo "🎃 SpecterSheet Deployment Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the specter-sheet directory."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test:run
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Fix them before deploying."
    exit 1
fi
echo "✅ All tests passed!"
echo ""

# Build
echo "🔨 Building for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Ask which platform
echo "Where do you want to deploy?"
echo "1) Vercel (recommended)"
echo "2) Netlify"
echo "3) Cancel"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        echo ""
        echo "✅ Deployed to Vercel!"
        echo "📝 Don't forget to update URLs in:"
        echo "   - README.md"
        echo "   - KIROWEEN_SUBMISSION.md"
        echo "   - DEVPOST_SUBMISSION.md"
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        echo ""
        echo "✅ Deployed to Netlify!"
        echo "📝 Don't forget to update URLs in:"
        echo "   - README.md"
        echo "   - KIROWEEN_SUBMISSION.md"
        echo "   - DEVPOST_SUBMISSION.md"
        ;;
    3)
        echo "Deployment cancelled."
        exit 0
        ;;
    *)
        echo "Invalid choice. Deployment cancelled."
        exit 1
        ;;
esac

echo ""
echo "🎃 Next steps:"
echo "1. Test your deployed app"
echo "2. Record your 3-minute demo video"
echo "3. Update all URLs in documentation"
echo "4. Submit to Kiroween!"
echo ""
echo "Good luck! 👻"
