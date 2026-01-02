import { validateAntiSnipeConfig, checkPurchaseLimit } from "../anti-snipe";
import { AntiSnipeConfig, UserPurchase } from "@oneguard/shared";

describe("Anti-Snipe Rules", () => {
  describe("validateAntiSnipeConfig", () => {
    it("should accept valid configuration", () => {
      const config: AntiSnipeConfig = {
        maxBuyPerWallet: 1000000,
        phasedUnlock: true,
        unlockDuration: 300,
        fairLaunchDelay: 600,
      };

      const result = validateAntiSnipeConfig(config);
      expect(result.valid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it("should reject negative max buy", () => {
      const config: AntiSnipeConfig = {
        maxBuyPerWallet: -100,
        phasedUnlock: false,
      };

      const result = validateAntiSnipeConfig(config);
      expect(result.valid).toBe(false);
      expect(result.violations).toContain("Max buy per wallet must be positive");
    });

    it("should require unlock duration when phased unlock enabled", () => {
      const config: AntiSnipeConfig = {
        maxBuyPerWallet: 1000000,
        phasedUnlock: true,
      };

      const result = validateAntiSnipeConfig(config);
      expect(result.valid).toBe(false);
      expect(result.violations).toContain("Phased unlock requires unlock duration");
    });
  });

  describe("checkPurchaseLimit", () => {
    it("should allow purchase within limit", () => {
      const config: AntiSnipeConfig = {
        maxBuyPerWallet: 1000000,
        phasedUnlock: false,
      };

      const purchase: UserPurchase = {
        wallet: "wallet1",
        launchId: "launch1",
        amount: 500000,
        timestamp: new Date(),
        txSignature: "sig1",
      };

      const result = checkPurchaseLimit(purchase, [], config, new Date());
      expect(result.valid).toBe(true);
    });

    it("should reject purchase exceeding limit", () => {
      const config: AntiSnipeConfig = {
        maxBuyPerWallet: 1000000,
        phasedUnlock: false,
      };

      const existingPurchases: UserPurchase[] = [
        {
          wallet: "wallet1",
          launchId: "launch1",
          amount: 800000,
          timestamp: new Date(),
          txSignature: "sig1",
        },
      ];

      const purchase: UserPurchase = {
        wallet: "wallet1",
        launchId: "launch1",
        amount: 300000,
        timestamp: new Date(),
        txSignature: "sig2",
      };

      const result = checkPurchaseLimit(purchase, existingPurchases, config, new Date());
      expect(result.valid).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });
});
