"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CreateLaunchSchema, type CreateLaunchInput } from "@oneguard/shared";
import { Shield } from "lucide-react";

export default function CreateLaunchPage() {
  const { publicKey, connected } = useWallet();
  const [formData, setFormData] = useState<Partial<CreateLaunchInput>>({
    tokenName: "",
    tokenSymbol: "",
    antiSnipe: {
      maxBuyPerWallet: 1000000,
      phasedUnlock: false,
      fairLaunchDelay: 300,
    },
    antiBundle: {
      detectBundles: true,
      maxWalletConcentration: 10,
      oneActionPerTx: true,
    },
    antiRug: {
      fixedSupply: true,
      revokeMintAuthority: true,
      revokeFreezeAuthority: true,
      lpLockDuration: 30 * 24 * 60 * 60,
    },
    usd1Config: {
      initialPrice: 1000000,
      totalSupply: 1000000000,
      liquidityAmount: 500000000,
      creatorAllocation: 100000000,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Connect Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your wallet to create a launch.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validated = CreateLaunchSchema.parse(formData);
      
      // Here you would call your API to create the launch
      console.log("Creating launch:", validated);
      
      // Reset errors
      setErrors({});
      
      alert("Launch creation would be submitted here!");
    } catch (error: any) {
      if (error.errors) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errorMap[err.path.join(".")] = err.message;
        });
        setErrors(errorMap);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Launch</h1>
          <p className="text-muted-foreground">
            Configure your security-first launch. All parameters are enforced by code.
          </p>
        </div>

        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm font-semibold text-destructive">Important Constraints</p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Mint and freeze authorities MUST be revoked (anti-rug)</li>
            <li>• Fixed supply is required (no additional minting)</li>
            <li>• All parameters are immutable after launch</li>
            <li>• No admin overrides or emergency backdoors</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Token Info */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Token Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Token Name</label>
                <input
                  type="text"
                  value={formData.tokenName}
                  onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="My Token"
                />
                {errors.tokenName && (
                  <p className="text-sm text-destructive mt-1">{errors.tokenName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Token Symbol</label>
                <input
                  type="text"
                  value={formData.tokenSymbol}
                  onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="MTK"
                />
                {errors.tokenSymbol && (
                  <p className="text-sm text-destructive mt-1">{errors.tokenSymbol}</p>
                )}
              </div>
            </div>
          </div>

          {/* Anti-Snipe Config */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Anti-Snipe Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max Buy Per Wallet</label>
                <input
                  type="number"
                  value={formData.antiSnipe?.maxBuyPerWallet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      antiSnipe: {
                        ...formData.antiSnipe!,
                        maxBuyPerWallet: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum tokens a single wallet can purchase
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fair Launch Delay (seconds)</label>
                <input
                  type="number"
                  value={formData.antiSnipe?.fairLaunchDelay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      antiSnipe: {
                        ...formData.antiSnipe!,
                        fairLaunchDelay: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Delay before trading opens (recommended: 300s = 5 min)
                </p>
              </div>
            </div>
          </div>

          {/* Anti-Bundle Config */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Anti-Bundle Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Wallet Concentration (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.antiBundle?.maxWalletConcentration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      antiBundle: {
                        ...formData.antiBundle!,
                        maxWalletConcentration: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum % of supply a wallet can hold (recommended: ≤10%)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.antiBundle?.detectBundles}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      antiBundle: {
                        ...formData.antiBundle!,
                        detectBundles: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Enable Bundle Detection</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.antiBundle?.oneActionPerTx}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      antiBundle: {
                        ...formData.antiBundle!,
                        oneActionPerTx: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Enforce One Action Per Transaction</label>
              </div>
            </div>
          </div>

          {/* USD1 Config */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">USD1 Launch Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Total Supply</label>
                <input
                  type="number"
                  value={formData.usd1Config?.totalSupply}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usd1Config: {
                        ...formData.usd1Config!,
                        totalSupply: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Liquidity Amount</label>
                <input
                  type="number"
                  value={formData.usd1Config?.liquidityAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usd1Config: {
                        ...formData.usd1Config!,
                        liquidityAmount: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-accent/50 border rounded-lg">
            <p className="text-sm">
              <strong>Before proceeding:</strong>
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>✓ I understand all parameters are immutable after launch</li>
              <li>✓ I understand mint/freeze authorities will be revoked</li>
              <li>✓ I understand this is not investment advice</li>
              <li>✓ I understand users must verify parameters themselves</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create Launch
          </button>
        </form>
      </div>
    </div>
  );
}
