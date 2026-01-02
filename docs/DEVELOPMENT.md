# ONEGUARD Development Guide

## Getting Started

### Prerequisites

- Node.js ≥20.0.0
- pnpm ≥8.0.0
- Rust & Anchor CLI (for Solana program)
- PostgreSQL ≥14
- Docker & Docker Compose

### Initial Setup

1. **Clone Repository**

```bash
git clone https://github.com/your-org/oneguard.git
cd oneguard
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Setup Environment Variables**

```bash
# Copy example env files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env

# Edit with your values
```

4. **Start PostgreSQL**

```bash
docker-compose up -d postgres
```

5. **Run Database Migrations**

```bash
pnpm db:migrate
```

6. **Build Packages**

```bash
pnpm build
```

### Development Workflow

**Start all services:**

```bash
pnpm dev
```

This starts:
- `apps/web` on http://localhost:3000
- `apps/api` on http://localhost:3001
- `apps/worker` in background

**Run tests:**

```bash
pnpm test
```

**Type checking:**

```bash
pnpm typecheck
```

**Linting:**

```bash
pnpm lint
```

## Project Structure

```
oneguard/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Express API server
│   └── worker/       # Event indexer
├── packages/
│   ├── shared/       # Shared types & constants
│   ├── rules/        # Constraint validation logic
│   └── db/           # Prisma schema & client
├── programs/
│   └── oneguard/     # Anchor Solana program
├── docs/             # Documentation
├── infra/            # Docker compose & config
└── .github/
    └── workflows/    # CI/CD
```

## Working on the Solana Program

### Build Program

```bash
cd programs/oneguard
anchor build
```

### Run Tests

```bash
anchor test
```

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

### Update Program ID

After deployment, update the program ID in:

1. `programs/oneguard/Anchor.toml`
2. `programs/oneguard/src/lib.rs` (declare_id!)
3. `packages/shared/src/constants.ts`

### Program Architecture

- `lib.rs`: Entry point and instruction handlers
- `state.rs`: Account structures
- `errors.rs`: Error definitions
- `events.rs`: Event definitions
- `instructions/`: Instruction implementations

## Working on the Frontend

### Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Solana wallet adapter

### Key Pages

- `/` - Homepage
- `/launches` - All launches
- `/launches/[id]` - Launch detail & verification
- `/create` - Create launch form
- `/docs` - Documentation

### Adding a New Page

1. Create file in `apps/web/src/app/[route]/page.tsx`
2. Add navigation link in `apps/web/src/components/header.tsx`

### Styling

Use Tailwind classes. Custom components in `src/components/`.

## Working on the API

### Routes

- `GET /api/launches` - List all launches
- `GET /api/launches/:id` - Get launch details
- `GET /api/launches/:id/stats` - Get launch stats
- `GET /api/launches/:id/verification` - Get verification report
- `GET /api/launches/:id/events` - Get launch events
- `GET /api/launches/:id/purchases` - Get purchase history

### Adding a New Endpoint

1. Add route in `apps/api/src/index.ts`
2. Query database using Prisma
3. Return JSON response

## Working on the Worker

The worker:
- Indexes on-chain events
- Generates verification reports
- Calculates launch statistics

### Key Functions

- `indexLaunches()` - Fetches and stores events
- `updateVerifications()` - Generates reports
- `updateStats()` - Calculates metrics

### Running Worker Standalone

```bash
cd apps/worker
pnpm dev
```

## Working on Shared Packages

### packages/shared

Types, schemas, and constants used across all apps.

**Adding a new type:**

1. Define in `src/types.ts`
2. Export from `src/index.ts`
3. Rebuild: `pnpm build`

### packages/rules

Validation logic for launch constraints.

**Adding a new rule:**

1. Add function in appropriate file (e.g., `src/anti-snipe.ts`)
2. Add tests in `src/__tests__/`
3. Export from `src/index.ts`
4. Run tests: `pnpm test`

### packages/db

Prisma database client.

**Modifying schema:**

1. Edit `prisma/schema.prisma`
2. Generate migration: `pnpm db:migrate`
3. Generate client: `pnpm db:generate`

## Testing

### Unit Tests (packages/rules)

```bash
cd packages/rules
pnpm test
```

### Anchor Tests (Solana program)

```bash
cd programs/oneguard
anchor test
```

### Integration Tests

(To be implemented)

## Database Management

### Create Migration

```bash
pnpm db:migrate
```

### Push Schema (Development)

```bash
pnpm db:push
```

### Prisma Studio

```bash
pnpm --filter @oneguard/db studio
```

### Reset Database

```bash
# WARNING: Deletes all data
docker-compose down -v
docker-compose up -d postgres
pnpm db:migrate
```

## Code Style

### TypeScript

- Use strict mode
- Prefer interfaces over types
- Use explicit return types for functions
- Use const assertions where appropriate

### React

- Use functional components
- Use TypeScript for props
- Prefer named exports
- Keep components small and focused

### Solana Program (Rust)

- Use Anchor framework conventions
- Add comprehensive error messages
- Emit events for all state changes
- Document security assumptions

## Common Tasks

### Add a New Launch Constraint

1. Update `packages/shared/src/types.ts` - Add to config types
2. Update `packages/shared/src/schemas.ts` - Add Zod validation
3. Update `programs/oneguard/src/state.rs` - Add to on-chain config
4. Update `programs/oneguard/src/instructions/` - Enforce constraint
5. Update `packages/rules/src/` - Add verification logic
6. Add tests in `packages/rules/src/__tests__/`
7. Update frontend form in `apps/web/src/app/create/page.tsx`

### Add a New Event

1. Define event in `programs/oneguard/src/events.rs`
2. Emit event in appropriate instruction
3. Add event type to `packages/shared/src/types.ts`
4. Index event in `apps/worker/src/index.ts`
5. Display event in `apps/web/src/app/launches/[id]/page.tsx`

### Add a New Verification Check

1. Add check logic in `packages/rules/src/`
2. Add test in `packages/rules/src/__tests__/`
3. Update `VerificationReport` type in `packages/shared/src/types.ts`
4. Update database schema in `packages/db/prisma/schema.prisma`
5. Update worker in `apps/worker/src/index.ts`
6. Display in verification report UI

## Debugging

### Frontend

- Use React DevTools
- Check browser console
- Use Next.js error overlay

### API

- Check server logs
- Use Postman/curl for testing
- Enable debug logging

### Solana Program

- Use `anchor logs` to view program logs
- Check Solana Explorer for transactions
- Use `solana-test-validator` locally

### Database

- Use Prisma Studio
- Check PostgreSQL logs
- Verify migrations applied

## Performance

### Frontend

- Use Next.js Image for images
- Lazy load components
- Minimize bundle size
- Use static generation where possible

### API

- Add database indexes
- Implement caching
- Paginate large responses
- Use connection pooling

### Worker

- Batch database operations
- Implement exponential backoff
- Handle rate limits
- Process in parallel where possible

## Security Best Practices

### Never

- Store private keys in code
- Trust user input without validation
- Skip authorization checks
- Log sensitive data

### Always

- Validate all inputs (Zod schemas)
- Use parameterized database queries (Prisma)
- Sanitize user content
- Implement rate limiting
- Use HTTPS in production

## Deployment

See `docs/SPECIFICATION.md` for deployment instructions.

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes with tests
4. Ensure CI passes
5. Submit pull request

## Getting Help

- Read documentation in `/docs`
- Check GitHub issues
- Review test files for examples

## Next Steps

After initial setup:

1. Explore the codebase
2. Run tests to verify setup
3. Make a small change
4. Read threat model and spec
5. Start building!
