# Cloudflare Setup Instructions

## 1. Create D1 Database

```bash
# Navigate to workers directory
cd workers

# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create veneth-contacts

# The output will give you a database_id, copy it to wrangler.toml
```

## 2. Update wrangler.toml

Replace `YOUR_DATABASE_ID_HERE` with the actual database ID from step 1.

## 3. Initialize D1 Database

```bash
# Apply the schema
npx wrangler d1 execute veneth-contacts --file=./schema.sql --local

# For production:
npx wrangler d1 execute veneth-contacts --file=./schema.sql --remote
```

## 4. Deploy the Worker

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# This will give you a URL like:
# https://veneth-contact-worker.your-subdomain.workers.dev
```

## 5. Update React App

In `src/App.tsx`, update the `WORKER_URL` constant with your deployed worker URL:

```typescript
const WORKER_URL = "https://veneth-contact-worker.your-subdomain.workers.dev";
```

## 6. View Submitted Data

```bash
# View all contacts
npx wrangler d1 execute veneth-contacts --command="SELECT * FROM contacts ORDER BY created_at DESC" --remote

# Or use Cloudflare Dashboard
# Dashboard > Workers & Pages > D1 > veneth-contacts > Query
```

## Environment Variables

You can also use Cloudflare's secret management:

```bash
npx wrangler secret put FROM_EMAIL
# Enter: noreply@yourdomain.com
```

## Troubleshooting

### CORS Errors
Make sure the worker has proper CORS headers (included by default).

### Database Not Found
Check that the `database_id` in `wrangler.toml` matches your D1 database.

### Worker Not Responding
Check Cloudflare Dashboard > Workers & Pages for deployment status and logs.
