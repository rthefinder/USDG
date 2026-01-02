import { PublicKey } from "@solana/web3.js";

// Network
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

// USD1 Token (placeholder - replace with actual USD1 mint)
export const USD1_MINT = new PublicKey("USD1111111111111111111111111111111111111111");

// ONEGUARD Program
export const ONEGUARD_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ONEGUARD_PROGRAM_ID || "11111111111111111111111111111111"
);

// Launch constraints
export const DEFAULT_MAX_BUY_PER_WALLET = 1000000; // 1M tokens
export const DEFAULT_MAX_WALLET_CONCENTRATION = 10; // 10%
export const DEFAULT_LP_LOCK_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
export const DEFAULT_FAIR_LAUNCH_DELAY = 300; // 5 minutes

// Verification thresholds
export const MAX_SNIPE_THRESHOLD = 0.05; // 5% per wallet is considered high risk
export const MAX_BUNDLE_CONCENTRATION = 0.15; // 15% in related wallets is suspicious
export const MIN_LP_LOCK_DAYS = 7; // Minimum 7 days LP lock recommended

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// UI
export const ITEMS_PER_PAGE = 20;
