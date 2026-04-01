---
name: vite-deploy
description: Deploy Vite React projects to Vercel and GitHub Pages
license: MIT
---

## What I do
Guides deployment for Vite-based React projects.

## Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Follow prompts to deploy

## GitHub Pages
1. Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```
2. Install gh-pages: `npm i -D gh-pages`
3. Set `base` in `vite.config.ts` to repo name

## When to use me
- Deploying the portfolio
- Setting up CI/CD
- Configuring build settings
