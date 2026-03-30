# Veneth Studio — Portfolio Website

A premium, Portavia-inspired portfolio website built with React + TypeScript + Vite.

🌐 **Live Site:** https://veneth-studio-portfolio.netlify.app

## ✨ Features
- Light/Dark mode toggle
- Custom lerp cursor with magnetic buttons
- Scroll-reveal animations with stagger
- Hero photo stack with animated blobs
- Services accordion
- Live project previews (iframe modal)
- Contact form with loading state
- Fully responsive (mobile/tablet/desktop)

## 🛠 Tech Stack
- React 18 + TypeScript
- Vite 5
- Pure CSS (custom properties, no Tailwind runtime)
- Playfair Display + Inter fonts

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## 🎨 Design Tokens (edit in `src/index.css`)

```css
:root {
  --cream:  #f8f4ee;   /* page background */
  --dark:   #18150f;   /* text, buttons */
  --accent: #c9a84c;   /* gold accent */
  --mid:    #6b5f52;   /* secondary text */
}
```

## 📦 Deploy to Netlify

```bash
# One-time setup
npm install -g netlify-cli
netlify login

# Deploy
netlify deploy --prod --dir=dist --site=545eb91b-7bec-4cba-aba5-7cfc528fc39c
```

Or push to GitHub and connect the repo at **app.netlify.com** — the `netlify.toml` handles everything automatically.

## 📁 Project Structure

```
src/
  App.tsx          — All components + page layout
  index.css        — Design system + animations
  veneth_photo.ts  — Profile photo (base64)
  main.tsx         — React entry point
public/
  veneth.png       — Original profile photo
netlify.toml       — Build + redirect config
.github/workflows/ — Auto-deploy on push to main
```

## 📐 Figma Design File
Import guide and design spec → see `veneth-design-spec.html`
