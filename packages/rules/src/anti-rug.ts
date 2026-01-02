import {
  AntiRugConfig,
  VerificationStatus,
  VerificationCheck,
  TokenAuthorities,
} from "@oneguard/shared";

export interface AntiRugValidationResult {
  valid: boolean;
  violations: string[];
}

/**
 * Validates anti-rug configuration
 */
export function validateAntiRugConfig(config: AntiRugConfig): AntiRugValidationResult {
  const violations: string[] = [];

  if (!config.fixedSupply) {
    violations.push("Fixed supply must be enabled for anti-rug protection");
  }

  if (!config.revokeMintAuthority) {
    violations.push("Mint authority must be revoked for anti-rug protection");
  }

  if (!config.revokeFreezeAuthority) {
    violations.push("Freeze authority must be revoked for anti-rug protection");
  }

  if (config.lpLockDuration && config.lpLockDuration < 7 * 24 * 60 * 60) {
    violations.push("LP lock duration should be at least 7 days");
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Verifies token authorities are properly revoked
 */
export function verifyAuthorities(authorities: TokenAuthorities): {
  mintRevoked: boolean;
  freezeRevoked: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  const mintRevoked = authorities.mintAuthority === null;
  const freezeRevoked = authorities.freezeAuthority === null;

  if (!mintRevoked) {
    violations.push(`Mint authority not revoked: ${authorities.mintAuthority}`);
  }

  if (!freezeRevoked) {
    violations.push(`Freeze authority not revoked: ${authorities.freezeAuthority}`);
  }

  return {
    mintRevoked,
    freezeRevoked,
    violations,
  };
}

/**
 * Calculates if LP lock duration is sufficient
 */
export function isLPLockSufficient(lockDuration?: number, minDays: number = 7): boolean {
  if (!lockDuration) return false;
  const minSeconds = minDays * 24 * 60 * 60;
  return lockDuration >= minSeconds;
}

/**
 * Generates verification report for anti-rug measures
 */
export function verifyAntiRug(
  config: AntiRugConfig,
  authorities: TokenAuthorities
): VerificationCheck {
  const checks: { name: string; passed: boolean; message: string }[] = [];

  // Check 1: Fixed supply configured
  checks.push({
    name: "Fixed Supply",
    passed: config.fixedSupply,
    message: config.fixedSupply ? "Supply is fixed" : "Supply is not fixed",
  });

  // Check 2: Mint authority revocation configured
  checks.push({
    name: "Mint Authority Revocation Required",
    passed: config.revokeMintAuthority,
    message: config.revokeMintAuthority
      ? "Mint authority revocation required"
      : "Mint authority not required to be revoked",
  });

  // Check 3: Freeze authority revocation configured
  checks.push({
    name: "Freeze Authority Revocation Required",
    passed: config.revokeFreezeAuthority,
    message: config.revokeFreezeAuthority
      ? "Freeze authority revocation required"
      : "Freeze authority not required to be revoked",
  });

  // Check 4: Verify actual mint authority status
  const { mintRevoked, freezeRevoked, violations: authViolations } = verifyAuthorities(authorities);

  checks.push({
    name: "Mint Authority Actually Revoked",
    passed: mintRevoked,
    message: mintRevoked ? "Mint authority is null" : "Mint authority still exists",
  });

  checks.push({
    name: "Freeze Authority Actually Revoked",
    passed: freezeRevoked,
    message: freezeRevoked ? "Freeze authority is null" : "Freeze authority still exists",
  });

  // Check 5: LP lock duration
  const hasLPLock = !!config.lpLockDuration;
  const lpLockSufficient = isLPLockSufficient(config.lpLockDuration);

  checks.push({
    name: "LP Lock Configured",
    passed: hasLPLock,
    message: hasLPLock
      ? `LP lock duration: ${config.lpLockDuration! / (24 * 60 * 60)} days`
      : "No LP lock configured",
  });

  if (hasLPLock) {
    checks.push({
      name: "LP Lock Sufficient Duration",
      passed: lpLockSufficient,
      message: lpLockSufficient
        ? "LP lock duration is sufficient (≥7 days)"
        : "LP lock duration is too short",
    });
  }

  // Check 6: Authorities verified on-chain
  checks.push({
    name: "Authorities Verified On-Chain",
    passed: authorities.verified,
    message: authorities.verified
      ? `Verified at ${authorities.checkedAt.toISOString()}`
      : "Authorities not yet verified on-chain",
  });

  const passedCount = checks.filter((c) => c.passed).length;
  const totalCount = checks.length;

  let status: VerificationStatus;
  if (passedCount === totalCount) {
    status = VerificationStatus.PASS;
  } else if (passedCount >= totalCount * 0.7) {
    status = VerificationStatus.WARN;
  } else {
    status = VerificationStatus.FAIL;
  }

  return { status, checks };
}
