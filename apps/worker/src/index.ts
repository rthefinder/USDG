import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { prisma, LaunchPhase, VerificationStatus } from "@oneguard/db";
import { generateVerificationReport } from "@oneguard/rules";
import { ONEGUARD_PROGRAM_ID, SOLANA_RPC_URL } from "@oneguard/shared";

const POLL_INTERVAL = 10000; // 10 seconds

class OneguardWorker {
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, "confirmed");
    this.programId = ONEGUARD_PROGRAM_ID;
    console.log("ONEGUARD Worker initialized");
    console.log("RPC:", SOLANA_RPC_URL);
    console.log("Program ID:", this.programId.toBase58());
  }

  async start() {
    console.log("Starting ONEGUARD worker...");

    // Run indexing loop
    while (true) {
      try {
        await this.indexLaunches();
        await this.updateVerifications();
        await this.updateStats();
      } catch (error) {
        console.error("Worker error:", error);
      }

      // Wait before next iteration
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  private async indexLaunches() {
    // In a real implementation, this would:
    // 1. Listen to program events
    // 2. Parse LaunchInitialized, AuthoritiesRevoked, TradingEnabled, etc.
    // 3. Store events in database
    // 4. Update launch states

    console.log("Indexing launches...");

    // Placeholder: Find launches that need indexing
    const launches = await prisma.launch.findMany({
      where: {
        phase: {
          not: LaunchPhase.FINALIZED,
        },
      },
      take: 10,
    });

    for (const launch of launches) {
      try {
        await this.indexLaunchEvents(launch.id, launch.tokenMint);
      } catch (error) {
        console.error(`Error indexing launch ${launch.id}:`, error);
      }
    }
  }

  private async indexLaunchEvents(launchId: string, tokenMint: string) {
    // In a real implementation:
    // 1. Fetch all signatures for the launch PDA
    // 2. Parse transaction details
    // 3. Extract events from logs
    // 4. Store in database

    console.log(`Indexing events for launch ${launchId}...`);

    // Placeholder for event indexing
    // This would parse Solana transaction logs and extract events
  }

  private async updateVerifications() {
    console.log("Updating verifications...");

    // Find launches without verification or with outdated verification
    const launches = await prisma.launch.findMany({
      where: {
        OR: [
          { verification: null },
          {
            verification: {
              generatedAt: {
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24h
              },
            },
          },
        ],
      },
      include: {
        purchases: true,
        authorities: true,
      },
      take: 10,
    });

    for (const launch of launches) {
      try {
        await this.generateVerification(launch);
      } catch (error) {
        console.error(`Error generating verification for ${launch.id}:`, error);
      }
    }
  }

  private async generateVerification(launch: any) {
    console.log(`Generating verification for launch ${launch.id}...`);

    const config = launch.config as any;

    // Fetch token authorities from chain
    const authorities = launch.authorities || {
      mintAuthority: null,
      freezeAuthority: null,
      verified: false,
      checkedAt: new Date(),
    };

    // Map purchases to the format expected by verifier
    const purchases = launch.purchases.map((p: any) => ({
      wallet: p.wallet,
      launchId: p.launchId,
      amount: Number(p.amount),
      timestamp: p.timestamp,
      txSignature: p.txSignature,
    }));

    // Generate verification report
    const report = generateVerificationReport(
      launch.id,
      config,
      purchases,
      authorities,
      this.programId.toBase58()
    );

    // Save to database
    await prisma.verification.upsert({
      where: { launchId: launch.id },
      create: {
        launchId: launch.id,
        antiSnipeStatus: report.antiSnipe.status as VerificationStatus,
        antiSnipeChecks: report.antiSnipe.checks as any,
        antiBundleStatus: report.antiBundle.status as VerificationStatus,
        antiBundleChecks: report.antiBundle.checks as any,
        antiRugStatus: report.antiRug.status as VerificationStatus,
        antiRugChecks: report.antiRug.checks as any,
        overallStatus: report.overallStatus as VerificationStatus,
        generatedAt: report.generatedAt,
        verifiedBy: report.verifiedBy,
      },
      update: {
        antiSnipeStatus: report.antiSnipe.status as VerificationStatus,
        antiSnipeChecks: report.antiSnipe.checks as any,
        antiBundleStatus: report.antiBundle.status as VerificationStatus,
        antiBundleChecks: report.antiBundle.checks as any,
        antiRugStatus: report.antiRug.status as VerificationStatus,
        antiRugChecks: report.antiRug.checks as any,
        overallStatus: report.overallStatus as VerificationStatus,
        generatedAt: report.generatedAt,
        verifiedBy: report.verifiedBy,
      },
    });

    console.log(`Verification complete for ${launch.id}: ${report.overallStatus}`);
  }

  private async updateStats() {
    console.log("Updating stats...");

    // Find launches that need stats updates
    const launches = await prisma.launch.findMany({
      include: {
        purchases: true,
      },
      take: 20,
    });

    for (const launch of launches) {
      try {
        await this.calculateStats(launch);
      } catch (error) {
        console.error(`Error calculating stats for ${launch.id}:`, error);
      }
    }
  }

  private async calculateStats(launch: any) {
    const purchases = launch.purchases;

    if (purchases.length === 0) {
      return;
    }

    // Calculate stats
    const uniqueWallets = new Set(purchases.map((p: any) => p.wallet));
    const totalVolume = purchases.reduce((sum: bigint, p: any) => sum + p.amount, BigInt(0));
    const averagePurchase = totalVolume / BigInt(purchases.length);

    // Find top holder
    const walletTotals = new Map<string, bigint>();
    purchases.forEach((p: any) => {
      const current = walletTotals.get(p.wallet) || BigInt(0);
      walletTotals.set(p.wallet, current + p.amount);
    });

    const topHolder = Array.from(walletTotals.values()).sort((a, b) =>
      a > b ? -1 : 1
    )[0] || BigInt(0);

    const config = launch.config as any;
    const totalSupply = config.usd1Config.totalSupply;
    const topHolderPercentage = (Number(topHolder) / totalSupply) * 100;

    // Save stats
    await prisma.launchStats.upsert({
      where: { launchId: launch.id },
      create: {
        launchId: launch.id,
        totalParticipants: uniqueWallets.size,
        totalVolume,
        averagePurchase,
        topHolderPercentage,
        lastUpdated: new Date(),
      },
      update: {
        totalParticipants: uniqueWallets.size,
        totalVolume,
        averagePurchase,
        topHolderPercentage,
        lastUpdated: new Date(),
      },
    });
  }
}

// Start worker
const worker = new OneguardWorker();
worker.start().catch((error) => {
  console.error("Fatal worker error:", error);
  process.exit(1);
});
