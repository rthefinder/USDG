# ONEGUARD Infrastructure

## Local Development

### Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432.

### Stop Services

```bash
docker-compose down
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```

## Environment Variables

Copy `.env.example` to `.env` in each app directory and update values:

- `apps/web/.env.local`
- `apps/api/.env`
- `apps/worker/.env`

## Production Deployment

### Requirements

- PostgreSQL database (managed service recommended)
- Solana RPC endpoint (Helius, QuickNode, or self-hosted)
- Node.js hosting (Vercel, Railway, etc.)

### Environment Variables

Set the following in production:

```bash
NODE_ENV=production
DATABASE_URL=<production-database-url>
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=<mainnet-rpc-url>
NEXT_PUBLIC_ONEGUARD_PROGRAM_ID=<deployed-program-id>
```

### Database Migrations

```bash
pnpm db:migrate
```

### Build

```bash
pnpm build
```

### Start

```bash
pnpm start
```

## Monitoring

- PostgreSQL: Use connection pooling (PgBouncer)
- API: Set up health checks
- Worker: Monitor logs for errors
- Frontend: Use analytics and error tracking

## Security

- Use SSL for database connections in production
- Set secure CORS policies
- Use environment variables for secrets
- Enable rate limiting on API
- Use CDN for frontend assets
