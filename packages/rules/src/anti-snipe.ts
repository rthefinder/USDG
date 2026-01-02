import {
  AntiSnipeConfig,
  VerificationStatus,
  VerificationCheck,
  UserPurchase,
} from "@oneguard/shared";

export interface AntiSnipeValidationResult {
  valid: boolean;
  violations: string[];
}

/**
 * Validates anti-snipe configuration
 */
export function validateAntiSnipeConfig(config: AntiSnipeConfig): AntiSnipeValidationResult {
  const violations: string[] = [];

  if (config.maxBuyPerWallet <= 0) {
    violations.push("Max buy per wallet must be positive");
  }

  if (config.phasedUnlock && !config.unlockDuration) {
    violations.push("Phased unlock requires unlock duration");
  }

  if (config.unlockDuration && config.unlockDuration < 60) {
    violations.push("Unlock duration must be at least 60 seconds");
  }

  if (config.fairLaunchDelay && config.fairLaunchDelay < 0) {
    violations.push("Fair launch delay cannot be negative");
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Checks if a purchase violates anti-snipe rules
 */
export function checkPurchaseLimit(
  purchase: UserPurchase,
  existingPurchases: UserPurchase[],
  config: AntiSnipeConfig,
  currentTime: Date
): AntiSnipeValidationResult {
  const violations: string[] = [];

  // Calculate total purchased by this wallet
  const totalPurchased = existingPurchases
    .filter((p) => p.wallet === purchase.wallet)
    .reduce((sum, p) => sum + p.amount, 0);

  const newTotal = totalPurchased + purchase.amount;

  if (newTotal > config.maxBuyPerWallet) {
    violations.push(
      `Purchase would exceed max buy limit. Current: ${totalPurchased}, Attempting: ${purchase.amount}, Limit: ${config.maxBuyPerWallet}`
    );
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Generates verification report for anti-snipe measures
 */
export function verifyAntiSnipe(
  config: AntiSnipeConfig,
  purchases: UserPurchase[]
): VerificationCheck {
  const checks: { name: string; passed: boolean; message: string }[] = [];

  // Check 1: Max buy limit is reasonable
  const hasReasonableLimit = config.maxBuyPerWallet > 0 && config.maxBuyPerWallet < 10000000;
  checks.push({
    name: "Reasonable Buy Limit",
    passed: hasReasonableLimit,
    message: hasReasonableLimit
      ? `Max buy per wallet: ${config.maxBuyPerWallet}`
      : "Buy limit is not within reasonable range",
  });

  // Check 2: Phased unlock configuration
  if (config.phasedUnlock) {
    const hasValidUnlock = !!config.unlockDuration && config.unlockDuration >= 60;
    checks.push({
      name: "Phased Unlock Configured",
      passed: hasValidUnlock,
      message: hasValidUnlock
        ? `Unlock duration: ${config.unlockDuration}s`
        : "Phased unlock improperly configured",
    });
  }

  // Check 3: Fair launch delay
  const hasFairDelay = config.fairLaunchDelay && config.fairLaunchDelay >= 300;
  checks.push({
    name: "Fair Launch Delay",
    passed: hasFairDelay,
    message: hasFairDelay
      ? `Fair launch delay: ${config.fairLaunchDelay}s`
      : "No or insufficient fair launch delay",
  });

  // Check 4: Analyze actual purchase patterns
  if (purchases.length > 0) {
    const walletPurchases = new Map<string, number>();
    purchases.forEach((p) => {
      const current = walletPurchases.get(p.wallet) || 0;
      walletPurchases.set(p.wallet, current + p.amount);
    });

    const violations = Array.from(walletPurchases.values()).filter(
      (amount) => amount > config.maxBuyPerWallet
    );

    checks.push({
      name: "No Limit Violations",
      passed: violations.length === 0,
      message:
        violations.length === 0
          ? "All purchases within limits"
          : `${violations.length} wallets exceeded limits`,
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
