import { z } from "zod";

export const AntiSnipeConfigSchema = z.object({
  maxBuyPerWallet: z.number().positive(),
  phasedUnlock: z.boolean(),
  unlockDuration: z.number().positive().optional(),
  fairLaunchDelay: z.number().nonnegative().optional(),
});

export const AntiBundleConfigSchema = z.object({
  detectBundles: z.boolean(),
  maxWalletConcentration: z.number().min(0).max(100),
  oneActionPerTx: z.boolean(),
});

export const AntiRugConfigSchema = z.object({
  fixedSupply: z.boolean(),
  revokeMintAuthority: z.boolean(),
  revokeFreezeAuthority: z.boolean(),
  lpLockDuration: z.number().positive().optional(),
});

export const USD1LaunchConfigSchema = z.object({
  initialPrice: z.number().positive(),
  totalSupply: z.number().positive(),
  liquidityAmount: z.number().positive(),
  creatorAllocation: z.number().min(0),
});

export const LaunchConfigSchema = z.object({
  tokenMint: z.string(),
  creator: z.string(),
  antiSnipe: AntiSnipeConfigSchema,
  antiBundle: AntiBundleConfigSchema,
  antiRug: AntiRugConfigSchema,
  usd1Config: USD1LaunchConfigSchema,
});

export const CreateLaunchSchema = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(10),
  tokenUri: z.string().url().optional(),
  antiSnipe: AntiSnipeConfigSchema,
  antiBundle: AntiBundleConfigSchema,
  antiRug: AntiRugConfigSchema,
  usd1Config: USD1LaunchConfigSchema,
});

export type CreateLaunchInput = z.infer<typeof CreateLaunchSchema>;
