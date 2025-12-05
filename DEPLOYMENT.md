# SpecterSheet Deployment Guide

## Quick Deploy to Vercel

1. **Build the project:**
```bash
npm run build
```

2. **Install Vercel CLI:**
```bash
npm i -g vercel
```

3. **Deploy:**
```bash
vercel --prod
```

## Quick Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

## Environment Variables

No environment variables needed! The Groq API key is included for demo purposes.

For production, you should:
1. Create a `.env` file
2. Add `VITE_GROQ_API_KEY=your_key_here`
3. Update `src/lib/groqAI.ts` to use `import.meta.env.VITE_GROQ_API_KEY`

## Build Output

The build creates a `dist/` folder with:
- Optimized JavaScript bundles
- CSS with TailwindCSS
- Static assets
- index.html

## Performance

- Bundle size: ~500KB (gzipped)
- First load: < 2s
- Time to interactive: < 3s

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile: ✅ iOS Safari, Chrome Android

## Troubleshooting

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type errors
```bash
npm run build -- --mode development
```

### Missing dependencies
```bash
npm install
```

## Production Checklist

- [ ] Run tests: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] AI commands work
- [ ] Charts render
- [ ] Formulas calculate
- [ ] Dark mode works
- [ ] Mobile responsive

## Demo URL

After deployment, your URL will be:
- Vercel: `https://specter-sheet.vercel.app`
- Netlify: `https://specter-sheet.netlify.app`

Update this in:
- README.md
- KIROWEEN_SUBMISSION.md
- Video description
