use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::OneguardError;
use crate::events::LPInitialized;

#[derive(Accounts)]
pub struct InitializeLp<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.token_mint.as_ref()],
        bump = launch.bump,
        has_one = creator
    )]
    pub launch: Account<'info, LaunchState>,
    
    #[account(
        init,
        payer = creator,
        space = LiquidityPoolState::LEN,
        seeds = [b"lp", launch.key().as_ref()],
        bump
    )]
    pub lp_state: Account<'info, LiquidityPoolState>,
    
    /// CHECK: LP mint account
    pub lp_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn initialize_lp(ctx: Context<InitializeLp>, lp_amount: u64) -> Result<()> {
    let launch = &ctx.accounts.launch;
    let lp_state = &mut ctx.accounts.lp_state;
    let clock = Clock::get()?;

    require!(
        launch.phase == LaunchPhase::TradingRestricted || launch.phase == LaunchPhase::TradingOpen,
        OneguardError::TradingNotEnabled
    );

    require!(
        launch.phase != LaunchPhase::Finalized,
        OneguardError::LaunchFinalized
    );

    lp_state.bump = ctx.bumps.lp_state;
    lp_state.launch = launch.key();
    lp_state.lp_mint = ctx.accounts.lp_mint.key();
    lp_state.lp_amount = lp_amount;
    lp_state.created_at = clock.unix_timestamp;

    // Set LP lock if configured
    lp_state.locked_until = launch.config.anti_rug.lp_lock_duration
        .map(|duration| clock.unix_timestamp + duration);

    emit!(LPInitialized {
        launch: launch.key(),
        lp_mint: lp_state.lp_mint,
        lp_amount,
        locked_until: lp_state.locked_until,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
