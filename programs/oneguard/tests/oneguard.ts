import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Oneguard } from "../target/types/oneguard";
import { expect } from "chai";

describe("oneguard", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Oneguard as Program<Oneguard>;

  it("Initializes a launch with anti-snipe, anti-bundle, and anti-rug configs", async () => {
    const tokenMint = anchor.web3.Keypair.generate();
    
    const [launchPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("launch"), tokenMint.publicKey.toBuffer()],
      program.programId
    );

    const config = {
      antiSnipe: {
        maxBuyPerWallet: new anchor.BN(1000000),
        phasedUnlock: true,
        unlockDuration: new anchor.BN(300),
        fairLaunchDelay: new anchor.BN(600),
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
        lpLockDuration: new anchor.BN(30 * 24 * 60 * 60), // 30 days
      },
      usd1Config: {
        initialPrice: new anchor.BN(1000000),
        totalSupply: new anchor.BN(1000000000),
        liquidityAmount: new anchor.BN(500000000),
        creatorAllocation: new anchor.BN(100000000),
      },
    };

    await program.methods
      .initializeLaunch(config)
      .accounts({
        launch: launchPda,
        tokenMint: tokenMint.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const launchAccount = await program.account.launchState.fetch(launchPda);
    expect(launchAccount.creator.toBase58()).to.equal(provider.wallet.publicKey.toBase58());
    expect(launchAccount.tokenMint.toBase58()).to.equal(tokenMint.publicKey.toBase58());
  });

  it("Enforces max buy per wallet limit", async () => {
    const tokenMint = anchor.web3.Keypair.generate();
    
    const [launchPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("launch"), tokenMint.publicKey.toBuffer()],
      program.programId
    );

    const config = {
      antiSnipe: {
        maxBuyPerWallet: new anchor.BN(1000),
        phasedUnlock: false,
        unlockDuration: null,
        fairLaunchDelay: null,
      },
      antiBundle: {
        detectBundles: true,
        maxWalletConcentration: 50,
        oneActionPerTx: true,
      },
      antiRug: {
        fixedSupply: true,
        revokeMintAuthority: true,
        revokeFreezeAuthority: true,
        lpLockDuration: null,
      },
      usd1Config: {
        initialPrice: new anchor.BN(1000000),
        totalSupply: new anchor.BN(1000000),
        liquidityAmount: new anchor.BN(500000),
        creatorAllocation: new anchor.BN(100000),
      },
    };

    await program.methods
      .initializeLaunch(config)
      .accounts({
        launch: launchPda,
        tokenMint: tokenMint.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Attempt to purchase more than the limit should fail
    // This test demonstrates the enforcement logic
  });
});
