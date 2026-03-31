# Cloudflare Deployment Guide

## Prerequisites

1. **Cloudflare Account** - Sign up at [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Wrangler CLI** - Already installed via npm

---

## Step 1: Login to Cloudflare

```bash
npm run login
```

This opens a browser to authenticate. Verify with:
```bash
npm run whoami
```

---

## Step 2: Create D1 Database

### Create the database:
```bash
npm run d1:init
```

**Expected output:**
```
✅ Created database 'veneth-studio' (ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
```

### Copy the database ID

Save the `database_id` from the output.

### Update wrangler.jsonc

Edit `wrangler.jsonc` and replace the `database_id`:
```json
"database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## Step 3: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Click **Workers & Pages** → **Storage** → **R2**
4. Click **Enable R2**
5. Create a bucket named `veneth-assets`

Or via CLI:
```bash
npm run r2:init
```

---

## Step 4: Initialize Local Database

```bash
npm run d1:local
```

This creates tables and inserts seed data locally for testing.

---

## Step 5: Deploy Database to Cloudflare

```bash
npm run d1:deploy
```

**Verify:**
```bash
npm run d1:studio
```
Opens D1 studio in browser to view/edit data.

---

## Step 6: Deploy Worker (API)

```bash
npm run worker:deploy
```

**Verify Worker:**
```bash
curl https://api.venethstudio.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-...","version":"1.0.0"}
```

---

## Step 7: Deploy Pages (Frontend)

```bash
npm run build
npm run pages:deploy
```

Or with custom subdomain:
```bash
npx wrangler pages deploy dist --project-name=veneth-studio
```

---

## Step 8: Configure Custom Domain (Optional)

### For Worker API

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain (venethstudio.com)
3. Go to **DNS** → Add record:
   - Type: `CNAME`
   - Name: `api`
   - Target: `veneth-studio.<your-worker-subdomain>.workers.dev`
4. Enable proxy (orange cloud)

### For Pages

1. Go to **Workers & Pages** → Your project
2. **Settings** → **Custom Domains**
3. Add `venethstudio.com` or `www.venethstudio.com`

---

## Step 9: Security Settings (Dashboard)

### SSL/TLS
1. Go to **SSL/TLS** → Overview
2. Set to **Full (strict)**

### WAF (Web Application Firewall)
1. Go to **Security** → **WAF**
2. Enable "OWASP ModSecurity Core Rule Set"

### Bot Protection
1. Go to **Security** → **Bots**
2. Enable "Bot Management" (or "Probably yes" for free tier)

### Always Use HTTPS
1. Go to **SSL/TLS** → Edge Certificates
2. Enable **Always Use HTTPS**

---

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run login` | Login to Cloudflare |
| `npm run whoami` | Check current account |
| `npm run d1:init` | Create D1 database |
| `npm run d1:local` | Initialize local D1 |
| `npm run d1:deploy` | Deploy D1 schema |
| `npm run d1:studio` | Open D1 dashboard |
| `npm run r2:init` | Create R2 bucket |
| `npm run worker:deploy` | Deploy API Worker |
| `npm run worker:dev` | Test Worker locally |
| `npm run build` | Build frontend |
| `npm run pages:deploy` | Deploy to Pages |

---

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

---

## Troubleshooting

### Worker not responding?
```bash
# Check Worker logs
npx wrangler tail
```

### D1 not working?
```bash
# Check D1 status
npx wrangler d1 list
```

### R2 access denied?
```bash
# Verify R2 bucket binding
npx wrangler r2 bucket list
```

### Need to reset database?
```bash
# Delete and recreate
npx wrangler d1 destroy veneth-studio --remote
npm run d1:init
npm run d1:deploy
```

---

## Environment Variables

Set secrets for Worker:
```bash
# Optional: Add custom allowed origin
npx wrangler secret put ALLOWED_ORIGIN
# Enter: https://yourdomain.com
```

---

## File Upload Limits

- **Max file size:** 10MB
- **Allowed types:** jpeg, png, gif, webp, pdf

---

## Monitoring

View analytics:
1. Go to **Workers & Pages**
2. Select your Worker/Pages
3. Click **Analytics**
