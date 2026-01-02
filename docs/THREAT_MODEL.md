# ONEGUARD Threat Model

## Attack Vectors & Mitigations

### 1. Sniping Attacks

**Attack**: Bots purchase large amounts immediately at launch, front-running legitimate users.

**Mitigations**:
- Max buy per wallet limit (enforced on-chain)
- Fair launch delay before trading opens
- Optional phased unlock of purchase limits
- Time-based rate limiting between purchases

**Limitations**:
- Multiple wallets can still be used (Sybil resistance is limited)
- Off-chain bots can still monitor for launch events
- Network congestion advantages are not eliminated

### 2. Bundle Attacks

**Attack**: Coordinated transactions from related wallets to circumvent single-wallet limits.

**Mitigations**:
- One action per transaction enforcement
- Wallet concentration limits (% of supply)
- Time delay detection between related purchases
- Bundle detection in verification reports

**Limitations**:
- Cannot cryptographically prove wallet relationship
- Sophisticated attackers can spread purchases over time
- Detection is probabilistic, not deterministic

### 3. Rug Pull Attacks

**Attack**: Creator drains liquidity or manipulates supply after launch.

**Mitigations**:
- **Fixed supply (immutable)**
- **Mint authority revoked (on-chain, verified)**
- **Freeze authority revoked (on-chain, verified)**
- Optional LP lock enforced by program
- All authority changes emit events
- Verification checks actual on-chain state

**Limitations**:
- Cannot prevent LP removal after lock expires
- Cannot prevent external smart contract vulnerabilities
- Cannot prevent social engineering attacks

### 4. Admin Abuse

**Attack**: Platform admin overrides safety rules or extracts value.

**Mitigations**:
- **No admin keys in program**
- **No emergency functions**
- **No upgradeable proxies**
- Immutable launch parameters
- Open-source code verification

**Limitations**:
- Frontend could theoretically be compromised
- Users must verify program code themselves
- DNS/hosting attacks still possible

### 5. Flash Loan Attacks

**Attack**: Use flash loans to temporarily hold large positions and manipulate price.

**Mitigations**:
- Transaction-level purchase limits
- No instant arbitrage mechanisms in program
- Purchases require holding tokens (not just temporary)

**Limitations**:
- Program doesn't interact with AMMs directly
- Relies on external DEX for price discovery
- Complex DeFi interactions are out of scope

### 6. Front-Running

**Attack**: MEV bots front-run purchase transactions to extract value.

**Mitigations**:
- Fair launch delay reduces time advantage
- Purchase limits reduce profit potential
- Transparent launch schedule

**Limitations**:
- Cannot eliminate MEV entirely on public blockchain
- Solana's leader schedule creates MEV opportunities
- This is a protocol-level challenge

### 7. Wash Trading

**Attack**: Self-trading to inflate volume and create false activity.

**Mitigations**:
- Verification reports show distribution metrics
- Top holder percentage calculation
- Purchase history is public

**Limitations**:
- Cannot cryptographically prevent self-trading
- Detection is heuristic
- Market manipulation is hard to prove on-chain

### 8. Smart Contract Bugs

**Attack**: Exploit bugs in ONEGUARD program to bypass constraints.

**Mitigations**:
- Unit tests for all constraints
- Integration tests with Anchor
- Open-source code for community review
- Immutable deployment (no upgrades)

**Limitations**:
- Zero-day vulnerabilities may exist
- Formal verification not performed
- Audit not yet completed

### 9. Oracle Manipulation

**Attack**: Manipulate USD1 price feed (if used).

**Mitigations**:
- Program doesn't depend on price oracles
- All pricing is deterministic and specified at launch
- No dynamic price feeds

**Limitations**:
- N/A - not applicable to current design

### 10. Governance Attacks

**Attack**: Take over governance to change parameters.

**Mitigations**:
- **No governance**
- **No parameter updates**
- Fully immutable after deployment

**Limitations**:
- Cannot fix bugs without redeployment
- Cannot adapt to new attack vectors
- Users must migrate to new program if needed

## Trust Assumptions

### Minimal Trust Requirements

- **Solana network security**: Assume validators are honest majority
- **RPC endpoint**: Indexer relies on RPC for event data
- **Database integrity**: Off-chain database can be compromised (but on-chain data is source of truth)

### No Trust Required

- ❌ Platform operators (no admin keys)
- ❌ Frontend (users can interact directly with program)
- ❌ API server (read-only, not authoritative)
- ❌ Worker (can be run by anyone)

## Verification Requirements

### User Due Diligence

Users MUST verify:

1. Token mint address
2. Mint authority is null
3. Freeze authority is null
4. Launch configuration matches expectations
5. Transaction history on Solana Explorer
6. Distribution metrics
7. Program ID matches official deployment

**The ONEGUARD badge is informational only.**

### Creator Responsibilities

Creators MUST understand:

1. All parameters are immutable
2. Authorities cannot be reclaimed
3. No backdoors or overrides exist
4. Users will verify everything themselves
5. Badge is not an endorsement

## Known Limitations

### 1. Sybil Resistance

- Multiple wallets can circumvent per-wallet limits
- No KYC or proof-of-personhood
- Economic deterrent only (transaction fees)

### 2. Off-Chain Components

- Frontend/API can be compromised
- Worker can be DOS'd (doesn't affect on-chain security)
- Database can be corrupted (on-chain data is canonical)

### 3. External Dependencies

- Relies on Solana network availability
- Relies on RPC endpoints for indexing
- Relies on DEX for actual trading (out of scope)

### 4. Regulatory Compliance

- No compliance checks
- No jurisdiction restrictions
- Not legal/financial advice

### 5. Token Quality

- **Does not verify token utility**
- **Does not prevent scams**
- **Does not guarantee value**
- Only enforces launch safety constraints

## Incident Response

### If Attack Detected

1. Document attack vector
2. Publish incident report
3. Update threat model
4. If program bug: Deploy v2 with fix
5. If external: Document in threat model

### What ONEGUARD Does NOT Cover

- Post-launch price manipulation
- Social engineering
- Phishing attacks
- External smart contract exploits
- Custody/wallet security
- Legal/regulatory issues

## Audit Status

- ⚠️ **Not yet audited**
- Internal review only
- Community review welcome
- Use at your own risk

## Disclaimer

ONEGUARD is a launch safety framework, not a security guarantee.

- No warranty expressed or implied
- Not investment advice
- Not financial advice
- Not a guarantee of profit
- Not a guarantee against loss

**Always verify everything yourself.**
