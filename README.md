# ONEGUARD ($USDG)

<img width="1024" height="1024" alt="Gemini_Generated_Image_rwbid0rwbid0rwbi" src="https://github.com/user-attachments/assets/40661155-08d0-4e03-ab68-c91786711215" />

**Security-First Launchpad for BONK-Style Coins on Solana**

[![CI](https://github.com/your-org/oneguard/workflows/CI/badge.svg)](https://github.com/your-org/oneguard/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚠️ CRITICAL DISCLAIMER

**THIS IS NOT AN INVESTMENT PLATFORM. THIS IS NOT A GUARANTEE OF PROFIT.**

ONEGUARD is a **launch safety framework** designed to make certain attack vectors technically impossible or heavily constrained by code. It does **NOT**:

- Guarantee profits
- Prevent all exploits
- Verify token quality or utility
- Provide investment advice
- Claim official authority
- Endorse any specific launch

**Always verify launch parameters yourself. Do your own research. Only risk funds you can afford to lose entirely.**

See [docs/LEGAL_DISCLAIMER.md](docs/LEGAL_DISCLAIMER.md) for full legal disclaimer.

---

## What is ONEGUARD?

ONEGUARD is the first security-first launchpad designed specifically for BONK-style meme coins priced in USD1 on Solana.

The current BONK / USD1 meta has **no dedicated infrastructure** to prevent:
- ❌ Excessive sniping
- ❌ Bundle abuse
- ❌ Supply manipulation
- ❌ Post-launch rug mechanics

ONEGUARD introduces a **strict, transparent launch standard** that makes these behaviors technically impossible or heavily constrained by design.

### Core Principles

- **Prevention by design, not promises**
- **Deterministic launch rules**
- **No trust assumptions**
- **Open-source verification**
- **Creator constraints enforced by code**

<img width="1024" height="1024" alt="Gemini_Generated_Image_1mxvoc1mxvoc1mxv" src="https://github.com/user-attachments/assets/eaa7ae12-a619-43f2-a9d5-707bad5fe04e" />

---

## Why BONK / USD1 Launches Need Protection

### The Problem

BONK-style token launches face three major attack vectors:

1. **Sniping**: Bots purchase large amounts immediately at launch, front-running legitimate users
2. **Bundling**: Coordinated transactions from multiple wallets circumvent single-wallet limits
3. **Rug Pulls**: Creators drain liquidity or manipulate supply after launch

### Current Solutions Are Insufficient

- "Trust me" promises → Easily broken
- Manual verification → Time-consuming and error-prone
- Upgradeable contracts → Admin abuse vectors
- Off-chain enforcement → Bypassable

### The ONEGUARD Approach

**On-chain enforcement + Immutable parameters + No admin overrides = Trustless launch safety**

---

## What ONEGUARD Solves

### 🛡️ Anti-Snipe Protection

**Problem**: Bots purchase massive amounts at launch, squeezing out real users.

**Solution**:
- ✅ Max buy per wallet enforced on-chain
- ✅ Optional phased unlock (time-based limits)
- ✅ Optional fair launch delay before full trading
- ✅ Purchase rate limiting

**Enforced by**: Solana smart contract (cannot be bypassed)

### 📊 Anti-Bundle Protection

**Problem**: Related wallets coordinate to circumvent per-wallet limits.

**Solution**:
- ✅ Bundle detection and blocking
- ✅ One action per transaction enforcement
- ✅ Wallet concentration limits (% of supply)
- ✅ Transparent allocation events

**Enforced by**: Transaction-level checks + verification reports

### 🔒 Anti-Rug Protection

**Problem**: Creator manipulates supply or drains liquidity post-launch.

**Solution**:
- ✅ **Fixed supply (immutable)**
- ✅ **Mint authority revoked on-chain (verified)**
- ✅ **Freeze authority revoked on-chain (verified)**
- ✅ No hidden mint instructions
- ✅ No creator-controlled drains
- ✅ Optional LP lock enforced by program

**Enforced by**: On-chain verification + immutable deployment

### 💎 USD1 Launch Standard

**Problem**: Inconsistent launch mechanics create confusion and risk.

**Solution**:
- ✅ All launches priced in USD1
- ✅ Deterministic price curve
- ✅ Transparent allocation math
- ✅ No hidden supply mechanics

**Enforced by**: Standardized launch flow

---

## What ONEGUARD Does NOT Promise

### ❌ Not a Profit Guarantee

ONEGUARD prevents certain attack vectors. It does **not** guarantee:
- Token price appreciation
- Project success
- Creator honesty beyond enforced parameters
- Protection against all possible exploits

### ❌ Not Investment Advice

Using ONEGUARD is **not** investment advice. We do not recommend:
- Buying any specific token
- Participating in any launch
- Expecting financial returns

### ❌ Not a Quality Verification

The ONEGUARD VERIFIED badge indicates that **launch safety constraints are enforced**. It does **not** verify:
- Token utility or use case
- Team reputation or doxxing
- Marketing claims
- Long-term viability

### ❌ Not Official Authority

ONEGUARD is **not affiliated with**:
- Solana Foundation
- BONK team
- USD1 creators
- Any regulatory body

---

## How Launches Are Enforced

### On-Chain Program (Anchor/Rust)

All constraints are enforced by an **immutable Solana smart contract**:

```rust
// Example: Max buy per wallet check (simplified)
let new_total = user_purchase.total_purchased + amount;
require!(
    new_total <= launch.config.anti_snipe.max_buy_per_wallet,
    OneguardError::MaxBuyExceeded
);
```

- No admin keys
- No upgrade authority
- No emergency overrides
- Parameters are immutable after initialization

### Verification System

Every launch receives an automated verification report:

- ✅ **Anti-Snipe**: PASS / WARN / FAIL
- ✅ **Anti-Bundle**: PASS / WARN / FAIL  
- ✅ **Anti-Rug**: PASS / WARN / FAIL

Reports check:
1. Configuration meets minimum standards
2. Authorities actually revoked (on-chain check)
3. Purchase patterns don't violate limits
4. Distribution metrics are healthy

### Event Transparency

All state changes emit **permanent on-chain events**:

- `LaunchInitialized`
- `AuthoritiesRevoked`
- `TradingEnabled`
- `PurchaseExecuted`
- `LPInitialized`
- `LaunchFinalized`

Events cannot be forged or deleted.

---

## How to Verify a Launch

**Never trust, always verify.**

### 1. Check the Verification Report

Every launch has a public verification report showing:
- Anti-snipe configuration and enforcement
- Anti-bundle detection results
- Anti-rug authority verification
- Purchase history analysis

### 2. Verify On-Chain

Use Solana Explorer to check:

```bash
# Token Mint Address
solana-explorer.com/address/<TOKEN_MINT>

# Check authorities (should be null)
- Mint Authority: null ✓
- Freeze Authority: null ✓

# Transaction history
- Review all transactions
- Verify events match report
```

### 3. Check the Smart Contract

```bash
# Fetch launch account
solana account <LAUNCH_PDA>

# Verify configuration matches UI
# Check program ID matches official deployment
```

### 4. Review Distribution

- Top holder percentage
- Number of unique wallets
- Purchase concentration
- Timing of purchases

### 5. Trust No One

The ONEGUARD badge is **informational only**. Do your own research.

---

## Features

### For Users

- 🔍 **Public Dashboard**: Browse all launches with verification status
- 📊 **Detailed Reports**: See exact constraints and verification checks
- 🔗 **On-Chain Verification**: Links to Solana Explorer for every claim
- 📈 **Distribution Analytics**: Understand token holder concentration
- ⚡ **Real-Time Events**: Track launch progress live

### For Creators

- 🚀 **Guided Launch Interface**: Step-by-step launch creation
- 🛡️ **Enforced Safety**: Constraints applied automatically
- 📝 **Parameter Preview**: See final configuration before launch
- ✅ **Automatic Verification**: Badge awarded upon meeting standards
- 🔒 **Immutable Deployment**: No ability to change parameters post-launch

### For Developers

- 📦 **Open Source**: Full code available for review
- 🧪 **Comprehensive Tests**: Unit and integration tests
- 📚 **Complete Docs**: Specs, threat model, development guide
- 🔧 **Monorepo**: Clean architecture with shared packages
- 🏗️ **Modular Design**: Easy to extend and audit

---

## Tech Stack

### On-Chain
- **Solana**: L1 blockchain
- **Anchor**: Solana program framework (Rust)
- **SPL Token**: Token standard

### Frontend
- **Next.js 14**: React framework (TypeScript)
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Solana Wallet Adapter**: Wallet integration

### Backend
- **Node.js**: Runtime
- **Express**: API server
- **PostgreSQL**: Database
- **Prisma**: ORM

### Tooling
- **Turborepo**: Monorepo management
- **pnpm**: Package manager
- **TypeScript**: Type safety
- **Zod**: Runtime validation
- **Docker**: Containerization
- **GitHub Actions**: CI/CD

---

## Repository Structure

```
oneguard/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # Express API server
│   └── worker/           # Event indexer & verifier
├── packages/
│   ├── shared/           # Types, schemas, constants
│   ├── rules/            # Constraint validation logic
│   └── db/               # Prisma schema & client
├── programs/
│   └── oneguard/         # Anchor Solana program
├── docs/
│   ├── SPECIFICATION.md  # Technical specification
│   ├── THREAT_MODEL.md   # Security analysis
│   ├── LEGAL_DISCLAIMER.md
│   └── DEVELOPMENT.md    # Development guide
├── infra/
│   ├── docker-compose.yml
│   └── .env.example
└── .github/
    └── workflows/        # CI/CD pipelines
```

---

## Getting Started

### Prerequisites

- Node.js ≥20.0.0
- pnpm ≥8.0.0
- Rust & Anchor CLI (for Solana program)
- PostgreSQL ≥14
- Docker (optional, for local postgres)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/oneguard.git
cd oneguard
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables**

```bash
# Copy example files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env

# Edit with your values
```

4. **Start PostgreSQL**

```bash
cd infra
docker-compose up -d
```

5. **Run database migrations**

```bash
pnpm db:migrate
```

6. **Build packages**

```bash
pnpm build
```

### Development

**Start all services:**

```bash
pnpm dev
```

This starts:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Worker: background process

**Run tests:**

```bash
pnpm test
```

**Type checking:**

```bash
pnpm typecheck
```

**Build Solana program:**

```bash
cd programs/oneguard
anchor build
anchor test
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development guide.

---

## Commands

### Monorepo Management

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages and apps
pnpm dev              # Start all apps in dev mode
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
pnpm clean            # Clean build artifacts
```

### Database

```bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema (dev only)
pnpm db:migrate       # Create and run migration
```

### Solana Program

```bash
cd programs/oneguard
anchor build          # Build program
anchor test           # Run tests
anchor deploy         # Deploy to cluster
```

---

## Documentation

- **[Technical Specification](docs/SPECIFICATION.md)** - Complete technical details
- **[Threat Model](docs/THREAT_MODEL.md)** - Security analysis and attack vectors
- **[Legal Disclaimer](docs/LEGAL_DISCLAIMER.md)** - Full legal terms
- **[Development Guide](docs/DEVELOPMENT.md)** - How to contribute

---

## Security

### Audit Status

⚠️ **Not yet audited**

This software is experimental and has not undergone a professional security audit. Use at your own risk.

### Reporting Vulnerabilities

If you discover a security vulnerability, please email: security@oneguard.xyz

**Do not** open a public issue for security vulnerabilities.

### Security Features

✅ Immutable launch parameters
✅ No admin keys or overrides
✅ On-chain authority verification
✅ Comprehensive event logging
✅ Open-source for community review

### Known Limitations

See [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) for complete threat analysis.

---

## Roadmap

### Phase 1: MVP (Current)

- ✅ Core Solana program
- ✅ Anti-snipe enforcement
- ✅ Anti-bundle detection
- ✅ Anti-rug verification
- ✅ Web dashboard
- ✅ Verification system
- ✅ Event indexing

### Phase 2: Enhancement

- ⬜ Professional security audit
- ⬜ Enhanced bundle detection algorithms
- ⬜ Advanced distribution analytics
- ⬜ Multi-DEX support
- ⬜ Mobile app
- ⬜ API rate limiting
- ⬜ Caching layer

### Phase 3: Ecosystem

- ⬜ Third-party integrations
- ⬜ SDK for developers
- ⬜ Plugin system
- ⬜ Enhanced verification badges
- ⬜ Community governance
- ⬜ Multi-chain exploration

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure CI passes
5. Submit pull request

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Comprehensive tests
- Clear documentation

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Community

- **Twitter**: [@oneguard_xyz](https://twitter.com/oneguard_xyz)
- **Discord**: [discord.gg/oneguard](https://discord.gg/oneguard)
- **GitHub**: [github.com/your-org/oneguard](https://github.com/your-org/oneguard)

---

## Acknowledgments

Built for the Solana ecosystem with inspiration from:
- BONK community
- USD1 innovation
- Open-source security research
- DeFi safety protocols

---

## Final Warnings

### ⚠️ YOU CAN LOSE ALL YOUR MONEY

Token launches are extremely risky. Only participate with funds you can afford to lose entirely.

### ⚠️ VERIFY EVERYTHING YOURSELF

Do not rely solely on the ONEGUARD badge. Check:
- Token authorities on Solana Explorer
- Launch parameters in smart contract
- Transaction history
- Distribution metrics
- Creator reputation

### ⚠️ NO OFFICIAL ENDORSEMENT

ONEGUARD is not affiliated with or endorsed by:
- Solana Foundation
- BONK team
- USD1 creators
- Any regulatory body

### ⚠️ EXPERIMENTAL SOFTWARE

This is experimental technology. Bugs may exist. Unexpected behavior may occur.

**USE AT YOUR OWN RISK.**

---

## Next Steps

1. ✅ Read [docs/LEGAL_DISCLAIMER.md](docs/LEGAL_DISCLAIMER.md)
2. ✅ Review [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md)
3. ✅ Check [docs/SPECIFICATION.md](docs/SPECIFICATION.md)
4. ✅ Explore the codebase
5. ✅ Run tests: `pnpm test`
6. ✅ Start building: `pnpm dev`

---

**Remember: This is a launch safety framework, not an investment platform. Always do your own research.**
