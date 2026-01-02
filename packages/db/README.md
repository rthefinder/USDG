# Database

PostgreSQL database schema and Prisma client for ONEGUARD.

## Setup

1. Ensure PostgreSQL is running (use docker-compose in /infra)
2. Set DATABASE_URL in your .env file
3. Run migrations:

```bash
pnpm db:migrate
```

## Commands

- `pnpm generate` - Generate Prisma client
- `pnpm push` - Push schema to database (dev)
- `pnpm migrate` - Create and run migrations
- `pnpm studio` - Open Prisma Studio

## Schema

See `prisma/schema.prisma` for the complete database schema.
