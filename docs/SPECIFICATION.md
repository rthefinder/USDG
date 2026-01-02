# ONEGUARD Technical Specification

## Overview

ONEGUARD is a security-first launchpad for BONK-style meme coins priced in USD1 on Solana.

## Architecture

### On-Chain Program (Solana/Anchor)

The ONEGUARD program enforces launch constraints at the protocol level:

- **Launch State**: Stores immutable configuration and tracks launch phase
- **User Purchase State**: Tracks per-wallet purchase totals to enforce limits
- **Liquidity Pool State**: Records LP creation and lock status

### Off-Chain Components

1. **Web Frontend** (Next.js)
   - Launch creation interface
   - Public dashboard
   - Verification report viewer

2. **API Server** (Express)
   - Read-only endpoints for launch data
   - Aggregated statistics
   - Event history

3. **Worker** (Node.js)
   - Indexes on-chain events
   - Generates verification reports
   - Calculates launch statistics

4. **Database** (PostgreSQL)
   - Launch metadata
   - Purchase history
   - Verification reports
   - Event logs

## Launch Flow

### 1. Initialization

Creator submits launch configuration:

```typescript
{
  tokenName: string,
  tokenSymbol: string,
  antiSnipe: {
    maxBuyPerWallet: number,
    phasedUnlock: boolean,
    unlockDuration?: number,
    fairLaunchDelay?: number
  },
  antiBundle: {
    detectBundles: boolean,
    maxWalletConcentration: number,
    oneActionPerTx: boolean
  },
  antiRug: {
    fixedSupply: true,              // REQUIRED
    revokeMintAuthority: true,      // REQUIRED
    revokeFreezeAuthority: true,    // REQUIRED
    lpLockDuration?: number
  },
  usd1Config: {
    initialPrice: number,
    totalSupply: number,
    liquidityAmount: number,
    creatorAllocation: number
  }
}
```

**On-chain validation:**
- Anti-rug requirements are enforced (fixed supply, authority revocation)
- Max buy limit is positive
- Wallet concentration is ≤100%

**Events emitted:**
- `LaunchInitialized`

### 2. Authority Revocation

Creator calls `revoke_authorities`:

- Mint authority → null
- Freeze authority → null
- Phase → `TRADING_RESTRICTED`

**Events emitted:**
- `AuthoritiesRevoked`

This step is **irreversible**.

### 3. Enable Trading

After optional fair launch delay, creator calls `enable_trading`:

- Checks delay has elapsed (if configured)
- Phase → `TRADING_OPEN`

**Events emitted:**
- `TradingEnabled`

### 4. Purchases

Users call `purchase(amount)`:

**Anti-snipe checks:**
- Total user purchases ≤ `maxBuyPerWallet`

**Anti-bundle checks:**
- One purchase per transaction (if configured)
- Time delay between purchases from same wallet
- Wallet total ≤ `maxWalletConcentration` of supply

**Events emitted:**
- `PurchaseExecuted`

### 5. LP Initialization

Creator calls `initialize_lp`:

- Records LP mint and amount
- Sets lock expiration (if configured)

**Events emitted:**
- `LPInitialized`

### 6. Finalization

Creator calls `finalize_launch`:

- Phase → `FINALIZED`
- Launch is immutable

**Events emitted:**
- `LaunchFinalized`

## Verification System

The worker generates a verification report for each launch:

### Anti-Snipe Verification

- ✓ Reasonable buy limit configured
- ✓ Phased unlock properly configured (if enabled)
- ✓ Fair launch delay ≥5 minutes (if enabled)
- ✓ No wallets exceeded limits

**Status:**
- PASS: All checks passed
- WARN: 60%+ checks passed
- FAIL: <60% checks passed

### Anti-Bundle Verification

- ✓ Bundle detection enabled
- ✓ One action per transaction enforced
- ✓ Reasonable concentration limit (≤15%)
- ✓ No bundled transactions detected
- ✓ All wallets within concentration limits

**Status:**
- PASS: All checks passed
- WARN: 60%+ checks passed
- FAIL: <60% checks passed

### Anti-Rug Verification

- ✓ Fixed supply configured
- ✓ Mint authority revocation required
- ✓ Freeze authority revocation required
- ✓ Mint authority actually revoked (on-chain check)
- ✓ Freeze authority actually revoked (on-chain check)
- ✓ LP lock configured (optional)
- ✓ LP lock ≥7 days (if configured)
- ✓ Authorities verified on-chain

**Status:**
- PASS: All checks passed
- WARN: 70%+ checks passed
- FAIL: <70% checks passed

### Overall Status

Most restrictive of all three categories.

## Data Model

See `packages/db/prisma/schema.prisma` for complete schema.

Key entities:

- **Launch**: Main launch record with configuration
- **Purchase**: Individual purchase records
- **LaunchEvent**: On-chain event log
- **TokenAuthority**: Authority verification status
- **Verification**: Generated verification report
- **LaunchStats**: Aggregated statistics

## Security Considerations

### Immutability

Once a launch is initialized, the following **cannot** be changed:

- Token mint address
- Anti-snipe configuration
- Anti-bundle configuration
- Anti-rug configuration
- USD1 launch configuration

### No Admin Overrides

The program contains **no** admin keys or emergency functions that can override launch rules.

### No Upgradeable Proxies

The program is deployed without upgrade authority.

### Event Transparency

All state changes emit events that are permanently logged on-chain.

### Verification Limitations

The ONEGUARD VERIFIED badge is **informational only**:

- Not a guarantee of profit
- Not a guarantee against all exploits
- Not an endorsement
- Not investment advice

Users must **always** verify launch parameters themselves.

## Rate Limits & Constraints

### Purchase Rate Limiting

- Minimum 1 second between purchases from same wallet
- Enforced at program level

### Wallet Concentration

Default: 10% of total supply per wallet
Range: 0-100%
Recommended: ≤10%

### LP Lock Duration

Recommended: ≥7 days
Common: 30 days

### Fair Launch Delay

Recommended: ≥300 seconds (5 minutes)
Enforced between `revoke_authorities` and `enable_trading`

## Testing

### Program Tests

```bash
cd programs/oneguard
anchor test
```

Tests verify:
- Launch initialization
- Authority revocation
- Purchase limits
- Wallet concentration
- Event emission

### Package Tests

```bash
pnpm test
```

Tests in `packages/rules` verify:
- Anti-snipe validation
- Anti-bundle detection
- Anti-rug verification
- Report generation

## Deployment

### Program Deployment

1. Build program:
   ```bash
   cd programs/oneguard
   anchor build
   ```

2. Deploy to devnet:
   ```bash
   anchor deploy --provider.cluster devnet
   ```

3. Update program ID in:
   - `Anchor.toml`
   - `packages/shared/src/constants.ts`
   - Environment variables

### Application Deployment

1. Set environment variables
2. Run database migrations:
   ```bash
   pnpm db:migrate
   ```
3. Build applications:
   ```bash
   pnpm build
   ```
4. Start services:
   ```bash
   docker-compose up -d
   pnpm start
   ```

## Monitoring

### Health Checks

- API: `GET /health`
- Worker: Logs to stdout

### Metrics

Track:
- Total launches
- Verification status distribution
- Purchase volume
- Participant counts

### Alerts

Monitor for:
- Worker failures
- Database connection issues
- RPC endpoint issues
- Failed verifications
