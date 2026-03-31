# Veneth Studio

A premium portfolio website built with React, Vite, and Cloudflare.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **3D Effects**: Three.js
- **Smooth Scroll**: Lenis
- **Styling**: Tailwind CSS
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1
- **Storage**: Cloudflare R2

## Getting Started

### Install Dependencies

```bash
npm run install:all
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Cloudflare Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

### Quick Setup

1. Login to Cloudflare:
```bash
npm run login
```

2. Create D1 Database:
```bash
npm run d1:init
```

3. Create R2 Bucket:
```bash
npm run r2:init
```

4. Deploy Schema:
```bash
npm run d1:deploy
```

5. Deploy Worker:
```bash
npm run worker:deploy
```

6. Deploy Frontend:
```bash
npm run pages:deploy
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── lib/
│   │   └── api.ts       # API client
│   ├── worker/
│   │   └── index.ts      # Cloudflare Worker API
│   └── db/
│       └── schema.sql    # D1 database schema
├── public/              # Static assets
└── wrangler.jsonc      # Cloudflare config
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Fetch all projects |
| GET | `/api/services` | Fetch all services |
| GET | `/api/testimonials` | Fetch all testimonials |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/upload` | Upload file to R2 |
| GET | `/api/files` | List uploaded files |
| GET | `/api/files/:name` | Get file |
| DELETE | `/api/files/:name` | Delete file |
| GET | `/api/health` | Health check |
