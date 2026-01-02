use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::OneguardError;
use crate::events::LaunchInitialized;

#[derive(Accounts)]
pub struct InitializeLaunch<'info> {
    #[account(
        init,
        payer = creator,
        space = LaunchState::LEN,
        seeds = [b"launch", token_mint.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, LaunchState>,
    
    /// CHECK: Token mint account
    pub token_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn initialize_launch(
    ctx: Context<InitializeLaunch>,
    config: LaunchConfigData,
) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let clock = Clock::get()?;

    // Validate anti-rug requirements
    require!(config.anti_rug.fixed_supply, OneguardError::FixedSupplyRequired);
    require!(
        config.anti_rug.revoke_mint_authority,
        OneguardError::MintAuthorityMustBeRevoked
    );
    require!(
        config.anti_rug.revoke_freeze_authority,
        OneguardError::FreezeAuthorityMustBeRevoked
    );

    // Validate anti-snipe
    require!(
        config.anti_snipe.max_buy_per_wallet > 0,
        OneguardError::InvalidConfig
    );

    // Validate anti-bundle
    require!(
        config.anti_bundle.max_wallet_concentration <= 100,
        OneguardError::InvalidConfig
    );

    launch.bump = ctx.bumps.launch;
    launch.creator = ctx.accounts.creator.key();
    launch.token_mint = ctx.accounts.token_mint.key();
    launch.config = config;
    launch.phase = LaunchPhase::Initialized;
    launch.created_at = clock.unix_timestamp;
    launch.launched_at = None;
    launch.finalized_at = None;
    launch.total_purchased = 0;
    launch.participant_count = 0;

    emit!(LaunchInitialized {
        launch: launch.key(),
        creator: launch.creator,
        token_mint: launch.token_mint,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
