import {
  LaunchConfig,
  VerificationReport,
  VerificationStatus,
  UserPurchase,
  TokenAuthorities,
} from "@oneguard/shared";
import { verifyAntiSnipe } from "./anti-snipe";
import { verifyAntiBundle } from "./anti-bundle";
import { verifyAntiRug } from "./anti-rug";

/**
 * Generates a complete verification report for a launch
 */
export function generateVerificationReport(
  launchId: string,
  config: LaunchConfig,
  purchases: UserPurchase[],
  authorities: TokenAuthorities,
  programId: string
): VerificationReport {
  const antiSnipe = verifyAntiSnipe(config.antiSnipe, purchases);
  const antiBundle = verifyAntiBundle(
    config.antiBundle,
    purchases,
    config.usd1Config.totalSupply
  );
  const antiRug = verifyAntiRug(config.antiRug, authorities);

  // Determine overall status - most restrictive
  let overallStatus: VerificationStatus;
  const statuses = [antiSnipe.status, antiBundle.status, antiRug.status];

  if (statuses.includes(VerificationStatus.FAIL)) {
    overallStatus = VerificationStatus.FAIL;
  } else if (statuses.includes(VerificationStatus.WARN)) {
    overallStatus = VerificationStatus.WARN;
  } else {
    overallStatus = VerificationStatus.PASS;
  }

  return {
    launchId,
    antiSnipe,
    antiBundle,
    antiRug,
    overallStatus,
    generatedAt: new Date(),
    verifiedBy: programId,
  };
}

/**
 * Checks if a launch configuration meets minimum safety standards
 */
export function meetsMinimumStandards(config: LaunchConfig): {
  meets: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Anti-snipe minimums
  if (!config.antiSnipe.maxBuyPerWallet || config.antiSnipe.maxBuyPerWallet <= 0) {
    violations.push("Must set max buy per wallet");
  }

  // Anti-bundle minimums
  if (!config.antiBundle.detectBundles) {
    violations.push("Bundle detection must be enabled");
  }

  if (config.antiBundle.maxWalletConcentration > 20) {
    violations.push("Max wallet concentration too high (>20%)");
  }

  // Anti-rug minimums (CRITICAL)
  if (!config.antiRug.fixedSupply) {
    violations.push("CRITICAL: Fixed supply must be enabled");
  }

  if (!config.antiRug.revokeMintAuthority) {
    violations.push("CRITICAL: Mint authority must be revoked");
  }

  if (!config.antiRug.revokeFreezeAuthority) {
    violations.push("CRITICAL: Freeze authority must be revoked");
  }

  return {
    meets: violations.length === 0,
    violations,
  };
}
