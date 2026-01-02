use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::OneguardError;
use crate::events::TradingEnabled;

#[derive(Accounts)]
pub struct EnableTrading<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.token_mint.as_ref()],
        bump = launch.bump,
        has_one = creator
    )]
    pub launch: Account<'info, LaunchState>,
    
    pub creator: Signer<'info>,
}

pub fn enable_trading(ctx: Context<EnableTrading>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let clock = Clock::get()?;

    require!(
        launch.phase == LaunchPhase::TradingRestricted,
        OneguardError::TradingAlreadyOpen
    );

    // Check fair launch delay if configured
    if let Some(delay) = launch.config.anti_snipe.fair_launch_delay {
        let launched_at = launch.launched_at.ok_or(OneguardError::AuthoritiesNotRevoked)?;
        let elapsed = clock.unix_timestamp - launched_at;
        require!(elapsed >= delay, OneguardError::FairLaunchDelayNotElapsed);
    }

    launch.phase = LaunchPhase::TradingOpen;

    emit!(TradingEnabled {
        launch: launch.key(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
