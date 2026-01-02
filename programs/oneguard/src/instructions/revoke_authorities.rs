use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, SetAuthority};
use spl_token::instruction::AuthorityType;
use crate::state::*;
use crate::errors::OneguardError;
use crate::events::AuthoritiesRevoked;

#[derive(Accounts)]
pub struct RevokeAuthorities<'info> {
    #[account(
        mut,
        seeds = [b"launch", token_mint.key().as_ref()],
        bump = launch.bump,
        has_one = creator,
        has_one = token_mint
    )]
    pub launch: Account<'info, LaunchState>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    pub creator: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn revoke_authorities(ctx: Context<RevokeAuthorities>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let clock = Clock::get()?;

    require!(
        launch.phase == LaunchPhase::Initialized,
        OneguardError::TradingAlreadyOpen
    );

    // Revoke mint authority if required
    let mut mint_revoked = false;
    if launch.config.anti_rug.revoke_mint_authority {
        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                SetAuthority {
                    account_or_mint: ctx.accounts.token_mint.to_account_info(),
                    current_authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            AuthorityType::MintTokens,
            None,
        )?;
        mint_revoked = true;
    }

    // Revoke freeze authority if required
    let mut freeze_revoked = false;
    if launch.config.anti_rug.revoke_freeze_authority {
        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                SetAuthority {
                    account_or_mint: ctx.accounts.token_mint.to_account_info(),
                    current_authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            AuthorityType::FreezeAccount,
            None,
        )?;
        freeze_revoked = true;
    }

    // Update phase to trading restricted
    launch.phase = LaunchPhase::TradingRestricted;
    launch.launched_at = Some(clock.unix_timestamp);

    emit!(AuthoritiesRevoked {
        launch: launch.key(),
        token_mint: launch.token_mint,
        mint_authority_revoked: mint_revoked,
        freeze_authority_revoked: freeze_revoked,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
