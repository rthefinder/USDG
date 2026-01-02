use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::OneguardError;
use crate::events::LaunchFinalized;

#[derive(Accounts)]
pub struct FinalizeLaunch<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.token_mint.as_ref()],
        bump = launch.bump,
        has_one = creator
    )]
    pub launch: Account<'info, LaunchState>,
    
    pub creator: Signer<'info>,
}

pub fn finalize_launch(ctx: Context<FinalizeLaunch>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let clock = Clock::get()?;

    require!(
        launch.phase != LaunchPhase::Finalized,
        OneguardError::LaunchFinalized
    );

    launch.phase = LaunchPhase::Finalized;
    launch.finalized_at = Some(clock.unix_timestamp);

    emit!(LaunchFinalized {
        launch: launch.key(),
        total_purchased: launch.total_purchased,
        participant_count: launch.participant_count,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
