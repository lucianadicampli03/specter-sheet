# Post-Build Hook Configuration

## Overview
Hooks that run after the build process completes.

## Active Hooks

### 1. Bundle Analysis
```bash
# Analyze bundle size
npx vite-bundle-analyzer
```
- **Purpose**: Monitor bundle size growth
- **Alert**: Warn if bundle exceeds 500KB

### 2. Lighthouse Audit
```bash
# Run Lighthouse CI
npx lighthouse-ci autorun
```
- **Purpose**: Ensure performance standards
- **Metrics**: Performance > 90, Accessibility > 90

### 3. Asset Optimization
- Compress images
- Generate WebP versions
- Create source maps

## Deployment Triggers

### Staging Deploy (on main branch)
1. Build completes successfully
2. All tests pass
3. Auto-deploy to Vercel preview

### Production Deploy (on release tag)
1. Build completes successfully
2. All tests pass
3. Manual approval required
4. Deploy to production

