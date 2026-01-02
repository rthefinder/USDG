import {
  AntiBundleConfig,
  VerificationStatus,
  VerificationCheck,
  UserPurchase,
} from "@oneguard/shared";

export interface AntiBundleValidationResult {
  valid: boolean;
  violations: string[];
}

/**
 * Validates anti-bundle configuration
 */
export function validateAntiBundleConfig(config: AntiBundleConfig): AntiBundleValidationResult {
  const violations: string[] = [];

  if (config.maxWalletConcentration < 0 || config.maxWalletConcentration > 100) {
    violations.push("Max wallet concentration must be between 0 and 100");
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Detects potential bundled transactions
 * Bundles are identified by:
 * - Multiple purchases in the same transaction
 * - Multiple purchases within very short time window from related wallets
 */
export function detectBundledTransactions(
  purchases: UserPurchase[],
  timeWindowMs: number = 5000
): string[][] {
  const bundles: string[][] = [];
  const txGroups = new Map<string, UserPurchase[]>();

  // Group by transaction signature
  purchases.forEach((p) => {
    const group = txGroups.get(p.txSignature) || [];
    group.push(p);
    txGroups.set(p.txSignature, group);
  });

  // Any transaction with multiple purchases is a bundle
  txGroups.forEach((group, txSig) => {
    if (group.length > 1) {
      bundles.push(group.map((p) => p.wallet));
    }
  });

  // Also check for rapid sequential purchases (potential coordinated bundle)
  const sortedPurchases = [...purchases].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  for (let i = 0; i < sortedPurchases.length - 1; i++) {
    const timeDiff =
      sortedPurchases[i + 1]!.timestamp.getTime() - sortedPurchases[i]!.timestamp.getTime();

    if (timeDiff < timeWindowMs && sortedPurchases[i]!.wallet !== sortedPurchases[i + 1]!.wallet) {
      // Potential coordinated bundle
      const coordinated = [sortedPurchases[i]!.wallet, sortedPurchases[i + 1]!.wallet];
      bundles.push(coordinated);
    }
  }

  return bundles;
}

/**
 * Calculates wallet concentration
 */
export function calculateWalletConcentration(
  purchases: UserPurchase[],
  totalSupply: number
): Map<string, number> {
  const walletHoldings = new Map<string, number>();

  purchases.forEach((p) => {
    const current = walletHoldings.get(p.wallet) || 0;
    walletHoldings.set(p.wallet, current + p.amount);
  });

  const concentrations = new Map<string, number>();
  walletHoldings.forEach((amount, wallet) => {
    concentrations.set(wallet, (amount / totalSupply) * 100);
  });

  return concentrations;
}

/**
 * Generates verification report for anti-bundle measures
 */
export function verifyAntiBundle(
  config: AntiBundleConfig,
  purchases: UserPurchase[],
  totalSupply: number
): VerificationCheck {
  const checks: { name: string; passed: boolean; message: string }[] = [];

  // Check 1: Bundle detection enabled
  checks.push({
    name: "Bundle Detection Enabled",
    passed: config.detectBundles,
    message: config.detectBundles
      ? "Bundle detection is active"
      : "Bundle detection is not enabled",
  });

  // Check 2: One action per transaction enforced
  checks.push({
    name: "One Action Per Transaction",
    passed: config.oneActionPerTx,
    message: config.oneActionPerTx
      ? "Single action per transaction enforced"
      : "Multiple actions per transaction allowed",
  });

  // Check 3: Reasonable concentration limit
  const hasReasonableLimit = config.maxWalletConcentration <= 15;
  checks.push({
    name: "Reasonable Concentration Limit",
    passed: hasReasonableLimit,
    message: `Max wallet concentration: ${config.maxWalletConcentration}%`,
  });

  // Check 4: Analyze actual bundles
  if (purchases.length > 0) {
    const bundles = detectBundledTransactions(purchases);
    const noBundles = bundles.length === 0;

    checks.push({
      name: "No Bundle Violations",
      passed: noBundles,
      message: noBundles ? "No bundled transactions detected" : `${bundles.length} bundles detected`,
    });
  }

  // Check 5: Check wallet concentration
  if (purchases.length > 0) {
    const concentrations = calculateWalletConcentration(purchases, totalSupply);
    const violations = Array.from(concentrations.values()).filter(
      (conc) => conc > config.maxWalletConcentration
    );

    checks.push({
      name: "Concentration Limits Respected",
      passed: violations.length === 0,
      message:
        violations.length === 0
          ? "All wallets within concentration limits"
          : `${violations.length} wallets exceed concentration limit`,
    });
  }

  const passedCount = checks.filter((c) => c.passed).length;
  const totalCount = checks.length;

  let status: VerificationStatus;
  if (passedCount === totalCount) {
    status = VerificationStatus.PASS;
  } else if (passedCount >= totalCount * 0.6) {
    status = VerificationStatus.WARN;
  } else {
    status = VerificationStatus.FAIL;
  }

  return { status, checks };
}
