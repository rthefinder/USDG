import { PublicKey } from "@solana/web3.js";

export enum LaunchPhase {
  INITIALIZED = "INITIALIZED",
  TRADING_RESTRICTED = "TRADING_RESTRICTED",
  TRADING_OPEN = "TRADING_OPEN",
  FINALIZED = "FINALIZED",
}

export enum VerificationStatus {
  PASS = "PASS",
  WARN = "WARN",
  FAIL = "FAIL",
}

export interface AntiSnipeConfig {
  maxBuyPerWallet: number;
  phasedUnlock: boolean;
  unlockDuration?: number; // seconds
  fairLaunchDelay?: number; // seconds
}

export interface AntiBundleConfig {
  detectBundles: boolean;
  maxWalletConcentration: number; // percentage (0-100)
  oneActionPerTx: boolean;
}

export interface AntiRugConfig {
  fixedSupply: boolean;
  revokeMintAuthority: boolean;
  revokeFreezeAuthority: boolean;
  lpLockDuration?: number; // seconds
}

export interface USD1LaunchConfig {
  initialPrice: number; // in USD1 (lamports)
  totalSupply: number;
  liquidityAmount: number;
  creatorAllocation: number;
}

export interface LaunchConfig {
  tokenMint: string;
  creator: string;
  antiSnipe: AntiSnipeConfig;
  antiBundle: AntiBundleConfig;
  antiRug: AntiRugConfig;
  usd1Config: USD1LaunchConfig;
}

export interface Launch {
  id: string;
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  creator: string;
  config: LaunchConfig;
  phase: LaunchPhase;
  createdAt: Date;
  launchedAt?: Date;
  finalizedAt?: Date;
  verification?: VerificationReport;
}

export interface VerificationCheck {
  status: VerificationStatus;
  checks: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export interface VerificationReport {
  launchId: string;
  antiSnipe: VerificationCheck;
  antiBundle: VerificationCheck;
  antiRug: VerificationCheck;
  overallStatus: VerificationStatus;
  generatedAt: Date;
  verifiedBy: string; // program ID
}

export interface TokenAuthorities {
  mintAuthority: string | null;
  freezeAuthority: string | null;
  verified: boolean;
  checkedAt: Date;
}

export interface LaunchEvent {
  signature: string;
  type: "LaunchInitialized" | "AuthoritiesRevoked" | "TradingEnabled" | "LPInitialized";
  launchId: string;
  timestamp: Date;
  data: any;
}

export interface UserPurchase {
  wallet: string;
  launchId: string;
  amount: number;
  timestamp: Date;
  txSignature: string;
}

export interface LaunchStats {
  totalParticipants: number;
  totalVolume: number;
  averagePurchase: number;
  topHolderPercentage: number;
  distribution: {
    range: string;
    count: number;
  }[];
}
